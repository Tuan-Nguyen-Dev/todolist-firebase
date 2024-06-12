import {View} from 'react-native';
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
import {CloseCircle} from 'iconsax-react-native';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import DropdownPicker from '../../components/DropdownPicker';
import {SelecModel} from '../../models/SelectModel';
import firestore from '@react-native-firebase/firestore';

const initValue: TaskModel = {
  title: '',
  description: '',
  dueDate: new Date(),
  start: new Date(),
  end: new Date(),
  uids: [],
  fileUrls: [],
};

const AddNewTask = ({navigation}: any) => {
  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [userSelect, setUserSelect] = useState<SelecModel[]>([]);

  useEffect(() => {
    handelGetAllUsers();
  }, []);

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
    console.log(taskDetail);
  };

  return (
    <Container back title="Add new task">
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
      </Section>
      <Section>
        <Button inline type="primary" title="Save" onPress={handleAddNewTask} />
      </Section>
    </Container>
  );
};

export default AddNewTask;
