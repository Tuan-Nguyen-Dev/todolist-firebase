import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {replaceName, Section, Space, Text} from '@bsdaoquang/rncomponent';
import InputComponent from '../../components/InputComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {TaskModel} from '../../models/TaskModel';
import {SearchNormal1} from 'iconsax-react-native';
import {colors} from '../../constansts/colors';

const ListTasks = ({navigation, route}: any) => {
  const {tasks}: {tasks: TaskModel[]} = route.params;

  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<TaskModel[]>([]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = tasks.filter(element =>
        replaceName(element.title)
          .toLowerCase()
          .includes(replaceName(searchKey).toLowerCase()),
      );

      setResults(items);
    }
  }, [searchKey]);
  return (
    <Container back title="List Task">
      <Section>
        <InputComponent
          value={searchKey}
          onChange={val => setSearchKey(val)}
          allowClear
          prefix={<SearchNormal1 size={20} color={colors.gray2} />}
          placeholder="Search"
        />
      </Section>

      <FlatList
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        data={searchKey ? results : tasks}
        ListEmptyComponent={
          <Section>
            <TextComponent text="Data not found!!!" />
          </Section>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              marginBottom: 25,
              paddingHorizontal: 16,
            }}
            onPress={() =>
              navigation.navigate('TaskDetail', {
                id: item.id,
              })
            }
            key={item.id}>
            <TitleComponent text={item.title} />
            <Text
              color={colors.white}
              numberOfLine={3}
              text={item.description}
            />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default ListTasks;

const styles = StyleSheet.create({});
