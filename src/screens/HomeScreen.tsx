import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../components/Container';
import {globalStyles} from '../styles/globalStyles';
import {Card, Row, Section, Space, Text} from '@bsdaoquang/rncomponent';
import {colors} from '../constansts/colors';
import {fontFamilies} from '../constansts/fontFamilies';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal,
} from 'iconsax-react-native';
import TagComponent from '../components/TagComponent';
import CicularComponent from '../components/CicularComponent';
import CardImageConponent from '../components/CardImageConponent';
import AvatarGroup from '../components/AvatarGroup';
import ProgressBarComponent from '../components/ProgressBarComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {TaskModel} from '../models/TaskModel';
import {monthNames} from '../constansts/appInfos';
import {add0ToNumber} from '../utils/add0ToNumber';

const date = new Date();
const HomeScreen = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgenTask, setUrgenTask] = useState<TaskModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    getNewTasks();
    // getUrgentTask();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const items = tasks.filter(element => element.isUrgent);

      setUrgenTask(items);
    }
  }, [tasks]);

  const getNewTasks = async () => {
    setIsLoading(true);
    firestore()
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .where('uids', 'array-contains', user?.uid)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Task is empty');
        } else {
          const items: TaskModel[] = [];
          snap.forEach((item: any) =>
            items.push({
              id: item.id,
              ...item.data(),
            }),
          );

          setTasks(items);
        }
      });
    setIsLoading(false);
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) =>
    navigation.navigate('TaskDetail', {
      id,
      color,
    });

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <Section>
          <Row justifyContent="space-between">
            <Element4 size={24} color={colors.desc} />
            <Notification size={24} color={colors.desc} />
          </Row>
        </Section>
        <Section>
          <Row>
            <View style={{flex: 1}}>
              <Text color={colors.white} text={`Hi, ${user?.email}`} />
              <TitleComponent
                text="Be Production today"
                color={colors.white}
                font={fontFamilies.semiBold}
                size={20}
              />
            </View>
            <TouchableOpacity onPress={async () => auth().signOut()}>
              <Logout size={22} color="coral" />
            </TouchableOpacity>
          </Row>
        </Section>

        <Section>
          <Row
            styles={[globalStyles.inputContainer]}
            onPress={() =>
              navigation.navigate('ListTasks', {
                tasks,
              })
            }>
            <TextComponent color={colors.gray2} text="Search task" />
            <SearchNormal size={20} color={colors.white} />
          </Row>
        </Section>
        <Section>
          <Card styles={{backgroundColor: colors.gray, marginHorizontal: 0}}>
            <Row>
              <View style={{flex: 1}}>
                <TitleComponent text="Task Progess" />
                <TextComponent
                  text={` ${
                    tasks.filter(
                      element => element.progress && element.progress === 1,
                    ).length
                  }/${tasks.length}`}
                />
                <Space height={10} />
                <Row justifyContent="flex-start">
                  <TagComponent
                    text={`${monthNames[date.getMonth()]} ${add0ToNumber(
                      date.getDate(),
                    )}`}
                  />
                </Row>
              </View>
              <View>
                <CicularComponent
                  value={Math.floor(
                    (tasks.filter(
                      element => element.progress && element.progress === 1,
                    ).length /
                      tasks.length) *
                      100,
                  )}
                />
              </View>
            </Row>
          </Card>
        </Section>
        {isLoading ? (
          <ActivityIndicator />
        ) : tasks.length > 0 ? (
          <Section>
            <Row
              justifyContent="flex-end"
              onPress={() =>
                navigation.navigate('ListTasks', {
                  tasks,
                })
              }>
              <TextComponent size={16} text="See All" flex={0} />
            </Row>
            <Space height={10} />
            <Row styles={{alignItems: 'flex-start'}}>
              <View style={{flex: 1}}>
                <CardImageConponent
                  onPress={() => handleMoveToTaskDetail(tasks[0].id)}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddNewTask', {
                        editable: true,
                        task: tasks[0],
                      })
                    }
                    style={[globalStyles.iconContainer]}>
                    <Edit2 size={20} color={colors.white} />
                  </TouchableOpacity>
                  <TitleComponent text={tasks[0].title} />
                  <Text
                    color={colors.white}
                    numberOfLine={2}
                    text={tasks[0].description}
                    size={15}
                  />

                  <View style={{marginVertical: 30}}>
                    <AvatarGroup uids={tasks[0].uids} />
                    {tasks[0].progress && (tasks[0].progress as number) >= 0 ? (
                      <ProgressBarComponent
                        percent={`${Math.floor(tasks[0].progress * 100)}%`}
                      />
                    ) : null}
                  </View>

                  <TextComponent
                    text={`Due ${
                      tasks[0]?.dueDate
                        ? new Date(tasks[0].dueDate.toDate()).toLocaleString()
                        : 'No due date'
                    }`}
                  />
                </CardImageConponent>
              </View>
              <Space width={16} />
              <View style={{flex: 1}}>
                {tasks[1] && (
                  <CardImageConponent
                    color="rgba(33,150,243,0.9)"
                    onPress={() =>
                      handleMoveToTaskDetail(
                        tasks[1].id,
                        'rgba(33,150,243,0.9)',
                      )
                    }>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddNewTask', {
                          editable: true,
                          task: tasks[1],
                        })
                      }
                      style={[globalStyles.iconContainer]}>
                      <Edit2 size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TitleComponent text={tasks[1].title} />
                    {tasks[1].uids && <AvatarGroup uids={tasks[1].uids} />}
                    {tasks[1].progress ? (
                      <ProgressBarComponent
                        percent={`${Math.floor(tasks[1].progress * 100)}%`}
                      />
                    ) : (
                      <></>
                    )}
                  </CardImageConponent>
                )}

                <Space height={10} />
                {tasks[2] && (
                  <CardImageConponent
                    color="rgba(18,181,22,0.9)"
                    onPress={() =>
                      handleMoveToTaskDetail(tasks[2].id, 'rgba(18,181,22,0.9)')
                    }>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddNewTask', {
                          editable: true,
                          task: tasks[2],
                        })
                      }
                      style={[globalStyles.iconContainer]}>
                      <Edit2 size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TitleComponent text={tasks[2].title} />
                    <Text
                      text={tasks[2].description}
                      numberOfLine={3}
                      color={colors.white}
                      size={15}
                    />
                  </CardImageConponent>
                )}
              </View>
            </Row>
          </Section>
        ) : (
          <></>
        )}

        <Section>
          {urgenTask.length > 0 &&
            urgenTask.map(item => (
              <View key={`index${item.id}`}>
                <TitleComponent text="Urgents task" />
                <Card
                  onPress={() => handleMoveToTaskDetail(item.id)}
                  key={`index${item.id}`}
                  styles={{backgroundColor: colors.gray, marginHorizontal: 0}}>
                  <Row>
                    <CicularComponent
                      value={item.progress ? item.progress * 100 : 0}
                      radius={36}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 12,
                      }}>
                      <TextComponent text={item.title} />
                    </View>
                  </Row>
                </Card>
              </View>
            ))}
        </Section>
      </Container>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddNewTask', {
              editable: false,
              task: undefined,
            })
          }
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 12,
              paddingVertical: 14,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
