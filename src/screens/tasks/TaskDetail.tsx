import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {Row, Section, Space} from '@bsdaoquang/rncomponent';
import TextComponent from '../../components/TextComponent';
import firestore from '@react-native-firebase/firestore';
import {TaskModel} from '../../models/TaskModel';
import {Clock} from 'iconsax-react-native';
import {colors} from '../../constansts/colors';
import AvatarGroup from '../../components/AvatarGroup';
import {HandleDateTime} from '../../utils/handeDateTime';
const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetails, setTaskDetails] = useState<TaskModel>();

  useEffect(() => {
    getTaskDetail();
  }, []);

  const getTaskDetail = () => {
    firestore()
      .doc(`tasks/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setTaskDetails({
            id,
            ...snap.data(),
          });
        } else {
          console.log(`Task detail not found`);
        }
      });
  };

  return taskDetails ? (
    <Container back isScroll title={taskDetails.title}>
      <Section
        styles={{
          backgroundColor: color ?? 'rgba(113, 77, 217, 0.9)',
          paddingVertical: 20,
        }}>
        <TextComponent text="Due Date" />
        <Row>
          <Row styles={{flex: 1}}>
            <Clock size={18} color={colors.text} />
            <Space width={8} />
            <TextComponent
              text={`${
                taskDetails.start
                  ? HandleDateTime.GetHour(taskDetails.start.toDate())
                  : 'No start date'
              } -${
                taskDetails.end
                  ? HandleDateTime.GetHour(taskDetails.end.toDate())
                  : 'No end date'
              }`}
            />
          </Row>

          <Row styles={{flex: 1}}>
            <Clock size={18} color={colors.text} />
            <Space width={8} />
            <TextComponent text={`June 13`} />
          </Row>
          <Row styles={{flex: 1}} justifyContent="flex-end">
            <AvatarGroup uids={taskDetails.uids} />
          </Row>
        </Row>
      </Section>
    </Container>
  ) : (
    <></>
  );
};

export default TaskDetail;
