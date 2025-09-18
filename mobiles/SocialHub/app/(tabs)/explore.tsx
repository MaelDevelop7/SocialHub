import { ScrollView, Text } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Explore 🌍</Text>

      {[1, 2, 3, 4].map((i) => (
        <Card key={i} style={{ marginBottom: 16, borderRadius: 12, elevation: 3 }}>
          <Card.Content>
            <Title>Topic {i}</Title>
            <Paragraph>Discover new things here!</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
