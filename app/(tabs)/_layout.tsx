import { Redirect, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '@/providers/authProvider';
export default function TabsLayout() {
  const {isAuthenticated} = useAuth();

  if(!isAuthenticated){
    return(
      <Redirect href="/(auth)" />
    )
  }
  return (
    
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: 'For you',
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="home" size={26} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="new"
          options={{
            headerTitle: 'Create post',
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="plus-square-o" size={26} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome name="user" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}