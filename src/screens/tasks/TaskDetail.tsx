import {Button, Card, Row, Section, Space} from '@bsdaoquang/rncomponent';
import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import {
  AddSquare,
  Calendar,
  Calendar1,
  Clock,
  TickCircle,
  TickSquare,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import AvatarGroup from '../../components/AvatarGroup';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import UploadFileComponent from '../../components/UploadFileComponent';
import {colors} from '../../constansts/colors';
import {fontFamilies} from '../../constansts/fontFamilies';
import {Attachment, SubTask, TaskModel} from '../../models/TaskModel';
import {calcFileSize} from '../../utils/calcFileSize';
import {HandleDateTime} from '../../utils/handeDateTime';
import ModalAddSubTask from '../../modals/ModalAddSubTask';
import {HandleNotification} from '../../utils/handleNotification';
import auth from '@react-native-firebase/auth';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetails, setTaskDetails] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isVisibleModalSubTask, setIsVisibleModalSubTask] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    getTaskDetail();
    getSubTaskById();
  }, [id]);

  useEffect(() => {
    if (taskDetails) {
      setProgress(taskDetails.progress ?? 0);
      setAttachments(taskDetails.attachments);
      setIsUrgent(taskDetails.isUrgent);
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
  }, [progress, attachments, taskDetails]);

  useEffect(() => {
    if (subTasks.length > 0) {
      const completedPercent =
        subTasks.filter(element => element.isCompleted).length /
        subTasks.length;

      setProgress(completedPercent);
    }
  }, [subTasks]);

  const handleUpdateUrgentState = () => {
    firestore().doc(`tasks/${id}`).update({
      isUrgent: !isUrgent,
      updatedAt: Date.now(),
    });
  };

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

  const getSubTaskById = () => {
    firestore()
      .collection('subTasks')
      .where('taskId', '==', id)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Data not found');
        } else {
          const items: SubTask[] = [];

          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setSubTasks(items);
        }
      });
  };

  const handleUpdateSubTask = async (id: string, isCompleted: boolean) => {
    try {
      await firestore()
        .doc(`subTasks/${id}`)
        .update({isCompleted: !isCompleted});
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveTask = () => {
    Alert.alert('Confrim', 'Are you sure,you want to remove', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          console.log('Cancel');
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await firestore()
            .doc(`tasks/${id}`)
            .delete()
            .then(() => {
              taskDetails?.uids.forEach(id => {
                HandleNotification.SendNotfication({
                  title: 'Delete task',
                  body: `Delete task by ${user?.email}`,
                  taskId: '',
                  memberId: id,
                });
              });

              navigation.goBack();
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
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
              <Calendar size={18} color={colors.text} />
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
          <Row onPress={handleUpdateUrgentState}>
            <TickSquare
              variant={isUrgent ? 'Bold' : 'Outline'}
              size={24}
              color={colors.white}
            />
            <TextComponent
              flex={1}
              font={fontFamilies.bold}
              size={18}
              text={`Is Ugrent`}
            />
          </Row>
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
                disabled
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
            <TouchableOpacity onPress={() => setIsVisibleModalSubTask(true)}>
              <AddSquare size={22} color={colors.success} variant="Bold" />
            </TouchableOpacity>
          </Row>
          <Space height={12} />
          {subTasks.length > 0 &&
            subTasks.map((item, index) => (
              <Card
                styles={{marginHorizontal: 0}}
                color={colors.bgColor}
                key={`subtask${index}`}>
                <Row
                  onPress={() =>
                    handleUpdateSubTask(item.id, item.isCompleted)
                  }>
                  <TickCircle
                    variant={item.isCompleted ? 'Bold' : 'Outline'}
                    color={colors.success}
                    size={22}
                  />
                  <Space width={10} />
                  <View style={{flex: 1, marginLeft: 12}}>
                    <TextComponent size={18} text={item.title} />
                    <TextComponent
                      size={14}
                      text={HandleDateTime.DateString(new Date(item.createAt))}
                    />
                  </View>
                </Row>
              </Card>
            ))}
        </Section>
        <Section>
          <Row onPress={handleRemoveTask}>
            <TextComponent text="Delete Task" color="red" flex={0} />
          </Row>
        </Section>
      </Container>
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 5,
            right: 5,
            left: 5,
          }}>
          <Button
            radius={12}
            type="primary"
            title="Update"
            onPress={handleUpdateTask}
          />
        </View>
      )}

      <ModalAddSubTask
        visible={isVisibleModalSubTask}
        onClose={() => setIsVisibleModalSubTask(false)}
        taskId={id}
      />
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
