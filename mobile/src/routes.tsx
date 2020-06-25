import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const appStack = createStackNavigator();

const routes = () => {
  return (
    <NavigationContainer>
      <appStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: '#f0f0f5'
          }
        }}
      >
        <appStack.Screen name="home" component={Home}></appStack.Screen>
        <appStack.Screen name="points" component={Points}></appStack.Screen>
        <appStack.Screen name="detail" component={Detail}></appStack.Screen>
      </appStack.Navigator>
    </NavigationContainer>
  );
};

export default routes;
