import { ScrollView, Text } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Welcome Home 👋</Text>

      {[1, 2, 3].map((i) => (
        <Card key={i} style={{ marginBottom: 16, borderRadius: 12, elevation: 3 }}>
          <Card.Content>
            <Title>Card {i}</Title>
            <Paragraph>This is some modern card content.</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
