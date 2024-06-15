import {Alert, PermissionsAndroid, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {Attachment, TaskModel} from '../../models/TaskModel';
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
import UploadFileComponent from '../../components/UploadFileComponent';

const initValue: TaskModel = {
  title: '',
  description: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  attachments: [],
  createdAt: undefined,
  isUrgent: false,
};
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import InputComponent from '../../components/InputComponent';

const AddNewTask = ({navigation, route}: any) => {
  const {editable, task}: {editable: boolean; task?: TaskModel} = route.params;

  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [userSelect, setUserSelect] = useState<SelecModel[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  // const [attachementUrl, setAttachementUrl] = useState<string[]>([]);
  // const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse>();
  // const [bytesTransferented, setBytesTransferented] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    handelGetAllUsers();
  }, []);

  useEffect(() => {
    user && setTaskDetail({...taskDetail, uids: [user.uid]});
  }, [user]);

  useEffect(() => {
    task &&
      setTaskDetail({
        ...taskDetail,
        title: task.title,
        description: task.description,
        uids: task.uids,
      });
    // console.log(task.title);
  }, [task]);

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
              label: item.data().displayName,
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
    if (user) {
      const data = {
        ...taskDetail,
        attachments,
        createdAt: task ? task.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      if (task) {
        await firestore()
          .doc(`tasks/${task.id}`)
          .update(data)
          .then(() => {
            console.log('Add new task successfully');
            navigation.goBack();
          });
      } else {
        await firestore()
          .collection('tasks')
          .add({...data, createdAt: firestore.FieldValue.serverTimestamp()})
          .then(() => {
            console.log('Add new task successfully');
            navigation.goBack();
          })
          .catch(error => console.log(error));
      }
      // console.log(data);
    } else {
      Alert.alert('You not logged in');
    }
  };

  return (
    <Container back title={task ? task.title : 'Add new task'} isScroll>
      <Section>
        <InputComponent
          value={taskDetail.title}
          onChange={val => handleChangeValue('title', val)}
          title="Title"
          allowClear
          placeholder="Title of task"
        />
        <InputComponent
          value={taskDetail.description}
          onChange={val => handleChangeValue('description', val)}
          title="Description"
          allowClear
          placeholder="Content"
          multible
          numberOfLine={3}
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
          <Row justifyContent="flex-start">
            <TitleComponent
              font={fontFamilies.medium}
              flex={0}
              text="Attachments"
            />
            <Space width={8} />
            {/* <AttachCircle size={20} color={colors.white} /> */}
            <UploadFileComponent
              onUpload={flie => setAttachments([...attachments, flie])}
            />
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
        <Button
          inline
          type="primary"
          title={task ? 'Update' : 'Save'}
          onPress={handleAddNewTask}
        />
      </Section>
    </Container>
  );
};

export default AddNewTask;
