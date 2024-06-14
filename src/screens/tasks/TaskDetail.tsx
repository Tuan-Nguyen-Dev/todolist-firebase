import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {Card, Row, Section, Space} from '@bsdaoquang/rncomponent';
import TextComponent from '../../components/TextComponent';
import firestore from '@react-native-firebase/firestore';
import {TaskModel} from '../../models/TaskModel';
import {
  AddSquare,
  Clock,
  DocumentUpload,
  TickCircle,
} from 'iconsax-react-native';
import {colors} from '../../constansts/colors';
import AvatarGroup from '../../components/AvatarGroup';
import {HandleDateTime} from '../../utils/handeDateTime';
import TitleComponent from '../../components/TitleComponent';
import {fontFamilies} from '../../constansts/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

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
            <TextComponent
              text={
                taskDetails.dueDate
                  ? HandleDateTime.DateString(taskDetails.dueDate.toDate())
                  : ''
              }
            />
          </Row>
          <Row styles={{flex: 1}} justifyContent="flex-end">
            <AvatarGroup uids={taskDetails.uids} />
          </Row>
        </Row>
      </Section>
      <Space height={10} />
      <Section>
        <TitleComponent
          text="Description"
          size={22}
          font={fontFamilies.medium}
        />
        <Space height={10} />
        <Card color={colors.gray} styles={{marginHorizontal: 0}}>
          <TextComponent text={taskDetails.description} />
        </Card>
      </Section>
      <Section>
        <Card color={colors.gray} styles={{marginHorizontal: 0}}>
          <Row>
            <TextComponent text="File & Links" />
            <Row styles={{flex: 1}} justifyContent="flex-start">
              <Ionicons name="document-text" size={38} color={'#0263D1'} />
              <AntDesign name="pdffile1" size={32} color={'#E5252A'} />
              <MaterialCommunityIcons
                name="file-excel"
                size={38}
                color={'#00733B'}
              />
              <DocumentUpload size={38} color={colors.white} />
            </Row>
          </Row>
        </Card>
      </Section>
      <Section>
        <Row>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: colors.success,
              marginRight: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: colors.success,
                width: 18,
                height: 18,
                borderRadius: 100,
              }}
            />
          </View>
          <TextComponent
            size={18}
            font={fontFamilies.medium}
            flex={1}
            text="Progress"
          />
        </Row>
        <Space height={10} />
        <Row>
          <View style={{flex: 1}}>
            <TextComponent text="Slide" />
          </View>
          <TextComponent text={'70%'} size={20} flex={0} />
        </Row>
      </Section>
      <Section>
        <Row justifyContent="space-between">
          <TitleComponent text="Sub task" />
          <TouchableOpacity>
            <AddSquare size={22} color={colors.success} variant="Bold" />
          </TouchableOpacity>
        </Row>
        <Space height={12} />
        {Array.from({length: 3}).map((item, index) => (
          <Card
            styles={{marginHorizontal: 0}}
            color={colors.bgColor}
            key={`subtask${index}`}>
            <Row>
              <TickCircle variant="Bold" color={colors.success} size={22} />
              <Space width={10} />
              <TextComponent text="asds" />
            </Row>
          </Card>
        ))}
      </Section>
    </Container>
  ) : (
    <></>
  );
};

export default TaskDetail;
