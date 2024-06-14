import {Button, Card, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import {
  AddSquare,
  Clock,
  DocumentUpload,
  TickCircle,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvatarGroup from '../../components/AvatarGroup';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constansts/colors';
import {fontFamilies} from '../../constansts/fontFamilies';
import {Attachment, TaskModel} from '../../models/TaskModel';
import {HandleDateTime} from '../../utils/handeDateTime';
import UploadFileComponent from '../../components/UploadFileComponent';
import {calcFileSize} from '../../utils/calcFileSize';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetails, setTaskDetails] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [subTasks, setSubTasks] = useState<any[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    getTaskDetail();
  }, []);

  useEffect(() => {
    if (taskDetails) {
      setProgress(taskDetails.progress ?? 0);
      setAttachments(taskDetails.attachments);
    }
  }, [taskDetails]);

  useEffect(() => {
    if (
      progress !== taskDetails?.progress ||
      attachments.length !== taskDetails?.attachments.length
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [progress, attachments, attachments]);

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

  const handleUpdateTask = async () => {
    const data = {...taskDetails, progress, attachments, updateAt: Date.now()};
    await firestore()
      .doc(`tasks/${id}`)
      .update(data)
      .then(() => {
        Alert.alert('Updated task details');
        navigation.goBack();
      })
      .catch(error => console.log(error));
  };

  return taskDetails ? (
    <>
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
          <Row justifyContent="space-between">
            <TitleComponent text="File and Links" font={fontFamilies.medium} />
            <UploadFileComponent
              onUpload={file => file && setAttachments([...attachments, file])}
            />
          </Row>
          {attachments.map((item, index) => (
            <View style={{justifyContent: 'flex-start'}} key={`item${index}`}>
              <TextComponent flex={0} text={item.name} />
              <TextComponent
                flex={0}
                text={calcFileSize(item.size)}
                size={12}
              />
            </View>
          ))}
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
              <Slider
                value={progress}
                onValueChange={val => setProgress(val[0])}
                thumbTintColor={colors.success}
                maximumTrackTintColor={colors.gray2}
                thumbStyle={{
                  borderWidth: 2,
                  borderColor: colors.white,
                }}
                minimumTrackTintColor={colors.success}
                trackStyle={{height: 10, borderRadius: 100}}
                animationType="timing"
              />
            </View>
            <TextComponent
              text={`${Math.floor(progress * 100)}%`}
              size={20}
              flex={0}
            />
          </Row>
          <Space height={10} />
        </Section>
        <Section>
          <Row justifyContent="space-between">
            <TitleComponent text="Sub task" />
            <TouchableOpacity>
              <AddSquare size={22} color={colors.success} variant="Bold" />
            </TouchableOpacity>
          </Row>
          <Space height={12} />
          {Array.from({length: 10}).map((item, index) => (
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
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
          }}>
          <Button
            radius={12}
            type="primary"
            title="Update"
            onPress={handleUpdateTask}
          />
        </View>
      )}
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
