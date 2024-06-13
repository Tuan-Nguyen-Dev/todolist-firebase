import {Alert, PermissionsAndroid, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {TaskModel} from '../../models/TaskModel';
import {
  Button,
  DateTime,
  Input,
  Row,
  Section,
  Space,
  Text,
} from '@bsdaoquang/rncomponent';
import {colors} from '../../constansts/colors';
import {AttachCircle, CloseCircle} from 'iconsax-react-native';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import DropdownPicker from '../../components/DropdownPicker';
import {SelecModel} from '../../models/SelectModel';
import firestore from '@react-native-firebase/firestore';
import TitleComponent from '../../components/TitleComponent';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {fontFamilies} from '../../constansts/fontFamilies';
import storage from '@react-native-firebase/storage';
import {calcFileSize} from '../../utils/calcFileSize';
import RNFetchBlob from 'rn-fetch-blob';

const initValue: TaskModel = {
  title: '',
  description: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  fileUrls: [],
  createdAt: undefined,
};

const AddNewTask = ({navigation}: any) => {
  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [userSelect, setUserSelect] = useState<SelecModel[]>([]);
  const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([]);
  const [attachementUrl, setAttachementUrl] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse>();
  const [status, setStatus] = useState('');
  const [bytesTransferented, setBytesTransferented] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handelGetAllUsers();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    }
  }, []);

  const getFilePath = async (file: DocumentPickerResponse) => {
    if (Platform.OS === 'ios') {
      return file.uri;
    } else {
      return await RNFetchBlob.fs.stat(file.uri);
    }
  };

  const handelGetAllUsers = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('User not found');
        } else {
          const items: SelecModel[] = [];
          snap.forEach(item => {
            items.push({
              label: item.data().name,
              value: item.id,
            });
          });
          setUserSelect(items);
        }
      })
      .catch(error => console.log(`Can not get users error: ${error.message}`));
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...taskDetail};

    item[`${id}`] = value;

    setTaskDetail(item);
  };

  const handleAddNewTask = async () => {
    const data = {
      ...taskDetail,
      fileUrls: attachementUrl,
    };

    await firestore()
      .collection('tasks')
      .add({...data, createdAt: firestore.FieldValue.serverTimestamp()})
      .then(() => {
        console.log('Add new task successfully');
        navigation.goBack();
      })
      .catch(error => console.log(error));
  };

  const handlePickerDocument = () => {
    DocumentPicker.pick({
      allowMultiSelection: false,
      // type: [DocumentPicker.types.audio],
    })
      .then(res => {
        setAttachments(res);
        res.forEach(item => handleUploadFileToStorage(item));
      })
      .catch(error => console.log(error));
  };

  const handleUploadFileToStorage = async (item: DocumentPickerResponse) => {
    const fileName = item.name ?? `files${Date.now()}`;
    const path = `document/${fileName}`;
    const items = [...attachementUrl];
    await storage().ref(path).putString(item.uri);

    await storage()
      .ref(path)
      .getDownloadURL()
      .then(url => {
        items.push(url);
        setAttachementUrl(items);
      })
      .catch(error => console.log(error));
  };

  return (
    <Container back title="Add new task" isScroll>
      <Section>
        <Input
          radius={12}
          labelStyleProps={{color: colors.white}}
          label="Title"
          value={taskDetail.title}
          onChange={val => handleChangeValue('title', val)}
          clear
          iconClear={<CloseCircle size={20} color={colors.blue} />}
          placeholder="Title of task"
          inputStyles={{color: colors.white}}
          styles={{backgroundColor: colors.dark}}
        />
        <Input
          radius={12}
          labelStyleProps={{color: colors.white}}
          label="Description"
          value={taskDetail.description}
          onChange={val => handleChangeValue('description', val)}
          clear
          iconClear={<CloseCircle size={20} color={colors.blue} />}
          placeholder="Content of task"
          inputStyles={{color: colors.white}}
          styles={{backgroundColor: colors.dark, alignItems: 'flex-start'}}
          minHeight={100}
        />
      </Section>
      <Section>
        {/* <Text text="Due date" color={colors.white} /> */}
        <DateTimePickerComponent
          title="Due date"
          placeholder="Choice date of task"
          type="date"
          selected={taskDetail.dueDate}
          onSelect={val => handleChangeValue('dueDate', val)}
        />
        <Row>
          <View style={{flex: 1}}>
            <Text text="Start Date" color={colors.white} />
            <DateTimePickerComponent
              selected={taskDetail.start}
              type="time"
              onSelect={val => handleChangeValue('start', val)}
            />
          </View>
          <Space width={15} />
          <View style={{flex: 1}}>
            <Text text="End Date" color={colors.white} />
            <DateTimePickerComponent
              selected={taskDetail.end}
              type="time"
              onSelect={val => handleChangeValue('end', val)}
            />
          </View>
        </Row>

        <DropdownPicker
          selected={taskDetail.uids}
          items={userSelect}
          onSelect={val => handleChangeValue('uids', val)}
          title="Members"
          mutible
        />
        <View>
          <Row onPress={handlePickerDocument} justifyContent="flex-start">
            <TitleComponent
              font={fontFamilies.medium}
              flex={0}
              text="Attachments"
            />
            <Space width={8} />
            <AttachCircle size={20} color={colors.white} />
          </Row>
          {attachments.length > 0 &&
            attachments.map((item, index) => (
              <Row key={`attachements${index}`}>
                <TextComponent text={item.name ?? ''} />
              </Row>
            ))}
        </View>
      </Section>

      <Section>
        <Button inline type="primary" title="Save" onPress={handleAddNewTask} />
      </Section>
    </Container>
  );
};

export default AddNewTask;
