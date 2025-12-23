import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Checkbox } from '../components/ui/Checkbox';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';

export function HeroUITestScreen() {
  const [checked, setChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView className="flex-1 bg-surface-950 p-4">
      <Text className="text-2xl font-bold text-surface-50 mb-6">Budget Tracker Components</Text>

      {/* Buttons */}
      <Card variant="default" padding="md" className="mb-4">
        <Text className="text-lg font-semibold text-surface-100 mb-3">Action Buttons</Text>
        <View className="gap-3">
          <Button variant="primary" size="md" fullWidth onPress={() => setModalVisible(true)}>
            Open Modal
          </Button>
          <Button variant="success" size="md" fullWidth>
            Add Income
          </Button>
          <Button variant="danger" size="md" fullWidth>
            Add Expense
          </Button>
          <Button variant="secondary" size="md" fullWidth>
            Cancel
          </Button>
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </View>
      </Card>

      {/* Input Fields */}
      <Card variant="default" padding="md" className="mb-4">
        <Text className="text-lg font-semibold text-surface-100 mb-3">Input Fields</Text>
        <View className="gap-4">
          <Input
            label="Description"
            placeholder="Enter description"
            value={text}
            onChangeText={setText}
          />
          <Input
            label="Amount"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <Input label="Notes" placeholder="Optional notes" error="This field has an error" />
        </View>
      </Card>

      {/* Badges */}
      <Card variant="default" padding="md" className="mb-4">
        <Text className="text-lg font-semibold text-surface-100 mb-3">Status Badges</Text>
        <View className="flex-row gap-2 flex-wrap">
          <Badge variant="primary" size="md">
            Active
          </Badge>
          <Badge variant="success" size="md">
            Completed
          </Badge>
          <Badge variant="danger" size="md">
            Overdue
          </Badge>
          <Badge variant="warning" size="md">
            Pending
          </Badge>
          <Badge variant="neutral" size="sm">
            Draft
          </Badge>
        </View>
      </Card>

      {/* Progress Bars */}
      <Card variant="default" padding="md" className="mb-4">
        <Text className="text-lg font-semibold text-surface-100 mb-3">Budget Progress</Text>
        <View className="gap-4">
          <ProgressBar progress={75} color="success" showPercentage label="Food & Dining" />
          <ProgressBar progress={90} color="warning" showPercentage label="Shopping" />
          <ProgressBar progress={120} color="danger" showPercentage label="Entertainment" />
        </View>
      </Card>

      {/* Checkbox */}
      <Card variant="default" padding="md" className="mb-4">
        <Text className="text-lg font-semibold text-surface-100 mb-3">Options</Text>
        <View className="gap-3">
          <Checkbox checked={checked} onCheckedChange={setChecked} label="Mark as recurring" />
          <Checkbox
            checked={switchValue}
            onCheckedChange={setSwitchValue}
            label="Enable budget alerts"
          />
        </View>
      </Card>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Add Transaction"
        footer={
          <View className="flex-row gap-3">
            <Button variant="secondary" fullWidth onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth onPress={() => setModalVisible(false)}>
              Save
            </Button>
          </View>
        }
      >
        <View className="gap-4">
          <Input label="Description" placeholder="Enter description" />
          <Input label="Amount" placeholder="0.00" keyboardType="decimal-pad" />
          <Checkbox label="Mark as recurring" />
        </View>
      </Modal>
    </ScrollView>
  );
}
