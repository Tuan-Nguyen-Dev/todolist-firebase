import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {Button, Input, Row} from '@bsdaoquang/rncomponent';
import TextComponent from '../components/TextComponent';
import {colors} from '../constansts/colors';
import TitleComponent from '../components/TitleComponent';
import firestore from '@react-native-firebase/firestore';

interface Props {
  visible: boolean;
  subTask?: any;
  onClose: () => void;
  taskId: string;
}

const initValue = {
  title: '',
  description: '',
  isCompleted: false,
};

const ModalAddSubTask = (props: Props) => {
  const {visible, onClose, subTask, taskId} = props;
  const [subTaskForm, setSubTaskForm] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveToDataBases = async () => {
    const data = {
      ...subTaskForm,
      createAt: Date.now(),
      updatedAt: Date.now(),
      taskId,
    };
    setIsLoading(true);

    try {
      await firestore().collection('subTasks').add(data);
      console.log('Done');
      setIsLoading(false);
      handleCloseModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  //   const handleChangeValue = (key: string, values: string) => {
  //     const data: any = {...subTask};
  //     data[key] = values;

  //     setSubTaskForm(data);
  //   };

  const handleCloseModal = () => {
    setSubTaskForm(initValue);
    onClose();
  };

  return (
    <Modal
      transparent
      style={[globalStyles.modal]}
      animationType="slide"
      visible={visible}>
      <View style={[globalStyles.modalContainer]}>
        <View style={[globalStyles.modalContent]}>
          <TitleComponent text="Add new subtask" color={colors.bgColor} />
          <View style={{paddingVertical: 14}}>
            <Input
              radius={12}
              placeholder="Title"
              label="Title"
              value={subTaskForm.title}
              onChange={val => setSubTaskForm({...subTaskForm, title: val})}
              clear
            />
            <Input
              radius={12}
              placeholder="Description"
              label="Description"
              value={subTaskForm.description}
              onChange={val =>
                setSubTaskForm({...subTaskForm, description: val})
              }
              clear
              inline
              rows={1}
            />
          </View>
          <Row>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleCloseModal}>
                <TextComponent text="Close" color={colors.bgColor} flex={0} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <Button
                loading={isLoading}
                title="Save"
                radius={12}
                color={colors.blue}
                onPress={handleSaveToDataBases}
              />
            </View>
          </Row>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddSubTask;
