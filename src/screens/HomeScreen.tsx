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

const HomeScreen = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgenTask, setUrgenTask] = useState<TaskModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    getNewTasks();
    getUrgentTask();
  }, []);

  const getNewTasks = async () => {
    setIsLoading(true);
    firestore()
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .where('uids', 'array-contains', user?.uid)
      .limit(3)
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

  const getUrgentTask = async () => {
    const filter = firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid)
      .where('isUrgent', '==', true);

    filter.onSnapshot(snap => {
      if (!snap.empty) {
        const items: TaskModel[] = [];
        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data(),
          });
        });
        setUrgenTask(items);
      } else {
        setUrgenTask([]);
      }
    });
  };

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
            onPress={() => navigation.navigate('SearchScreen')}>
            <TextComponent color={colors.gray2} text="Search task" />
            <SearchNormal size={20} color={colors.white} />
          </Row>
        </Section>
        <Section>
          <Card styles={{backgroundColor: colors.gray, marginHorizontal: 0}}>
            <Row>
              <View style={{flex: 1}}>
                <TitleComponent text="Task Progess" />
                <TextComponent text="30/40t task done !" />
                <Space height={10} />
                <Row justifyContent="flex-start">
                  <TagComponent
                    text="Match 22"
                    onPress={() => console.log('Say hi >>>')}
                  />
                </Row>
              </View>
              <View>
                <CicularComponent value={80} />
              </View>
            </Row>
          </Card>
        </Section>
        {isLoading ? (
          <ActivityIndicator />
        ) : tasks.length > 0 ? (
          <Section>
            <Row styles={{alignItems: 'flex-start'}}>
              <View style={{flex: 1}}>
                <CardImageConponent
                  onPress={() =>
                    navigation.navigate('TaskDetail', {
                      id: tasks[0].id,
                    })
                  }>
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
                      navigation.navigate('TaskDetail', {
                        id: tasks[1].id,
                        color: 'rgba(33,150,243,0.9)',
                      })
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
                    {tasks[1].progress && (
                      <ProgressBarComponent
                        percent={`${Math.floor(tasks[1].progress * 100)}%`}
                      />
                    )}
                  </CardImageConponent>
                )}

                <Space height={10} />
                {tasks[2] && (
                  <CardImageConponent
                    color="rgba(18,181,22,0.9)"
                    onPress={() =>
                      navigation.navigate('TaskDetail', {
                        id: tasks[2].id,
                        color: 'rgba(18,181,22,0.9)',
                      })
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
                    <TextComponent text={tasks[2].description} size={15} />
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
              <>
                <TitleComponent text="Urgents task" />
                <Card
                  key={`${item.id}`}
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
              </>
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
          onPress={() => navigation.navigate('AddNewTask')}
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
          onPress={() => navigation.navigate('AddNewTask')}
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
