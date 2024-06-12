import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelecModel} from '../models/SelectModel';
import TitleComponent from './TitleComponent';
import {Button, Input, Row, Space, Text} from '@bsdaoquang/rncomponent';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../constansts/colors';
import {
  ArrowDown2,
  CloseCircle,
  SearchNormal1,
  TickCircle,
} from 'iconsax-react-native';
import TextComponent from './TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  title?: string;
  items: SelecModel[];
  selected?: string[];
  onSelect: (val: string[]) => void;
  mutible?: boolean;
}

const DropdownPicker = (props: Props) => {
  const {items, onSelect, mutible, selected, title} = props;

  const [isVisible, setIsVisible] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<SelecModel[]>([]);
  const [dataSelected, setDataSelected] = useState<string[]>([]);

  useEffect(() => {
    selected && setDataSelected(selected);
  }, [isVisible, selected]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const data = items.filter(element =>
        element.label.toLowerCase().includes(searchKey.toLowerCase()),
      );
      setResults(data);
    }
  }, [searchKey]);

  const handleSelecItem = (id: string) => {
    if (mutible) {
      const data = [...dataSelected];
      const index = data.findIndex(element => element === id);

      if (index !== -1) {
        data.splice(index, 1);
      } else {
        data.push(id);
      }

      setDataSelected(data);
    } else {
      setDataSelected([id]);
    }
  };

  const handleConfrimSelect = () => {
    onSelect(dataSelected);

    setIsVisible(false);
    setDataSelected([]);
  };

  const handleRemoveItemSelected = (index: number) => {
    if (selected) {
      selected?.splice(index, 1);
      onSelect(selected);
    }
  };

  const renderSelectedItem = (id: string, index: number) => {
    const item = items.find(element => element.value === id);
    return (
      item && (
        <Row
          onPress={() => handleRemoveItemSelected(index)}
          styles={{
            marginRight: 4,
            padding: 4,
            borderRadius: 100,
            borderWidth: 0.5,
            borderColor: colors.gray2,
            marginBottom: 8,
          }}
          key={id}>
          <TextComponent text={item.label} flex={0} />
          <Space width={15} />
          <AntDesign name="close" size={14} color={colors.white} />
        </Row>
      )
    );
  };
  return (
    <View style={{marginBottom: 16}}>
      {title && <TitleComponent text={title} />}
      <Row
        onPress={() => setIsVisible(true)}
        styles={[
          globalStyles.inputContainer,
          {marginTop: title ? 8 : 0, paddingVertical: 16},
        ]}>
        <View style={{flex: 1, paddingRight: 12}}>
          {selected && selected.length > 0 ? (
            <Row justifyContent="flex-start" styles={{flexWrap: 'wrap'}}>
              {selected.map((id, index) => renderSelectedItem(id, index))}
            </Row>
          ) : (
            <Text text="Select" color={colors.gray2} flex={0} />
          )}
        </View>
        <ArrowDown2 size={20} color={colors.text} />
      </Row>
      <Modal
        visible={isVisible}
        style={{flex: 1}}
        transparent
        animationType="slide"
        statusBarTranslucent>
        <View
          style={[
            globalStyles.container,
            {padding: 20, paddingTop: 60, paddingBottom: 60},
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Row>
                <View style={{flex: 1}}>
                  <Input
                    value={searchKey}
                    inputStyles={{
                      color: colors.white,
                    }}
                    radius={10}
                    onChange={val => setSearchKey(val)}
                    styles={{backgroundColor: colors.dark}}
                    clear
                    iconClear={<CloseCircle size={20} color={colors.blue} />}
                    placeholder="Search .."
                    prefix={<SearchNormal1 size={20} color={colors.gray2} />}
                  />
                </View>
                <Space width={10} />
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <TextComponent text="Cancel" color="coral" flex={0} />
                </TouchableOpacity>
              </Row>
            }
            style={{flex: 1}}
            data={searchKey ? results : items}
            renderItem={({item}) => (
              <Row
                onPress={() => handleSelecItem(item.value)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  text={item.label}
                  color={
                    dataSelected.includes(item.value) ? 'coral' : colors.text
                  }
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={20} color="coral" />
                )}
              </Row>
            )}
          />
          <Button
            title="CONFRIM"
            onPress={handleConfrimSelect}
            radius={10}
            type="primary"
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropdownPicker;

const styles = StyleSheet.create({});
