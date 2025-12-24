import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { NavigationBar, NavigationStack, Scene, TabBar, TabBarItem } from 'navigation-react-native';
import { useContext, useMemo } from 'react';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { BudgetsScreen } from '../screens/BudgetsScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { HubScreen } from '../screens/HubScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { PlanScreen } from '../screens/PlanScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { stateNavigator } from './stateNavigator';

// Hook to create new StateNavigator instances for each tab
const useStateNavigator = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return useMemo(() => new StateNavigator(stateNavigator), []);
};

const Tabs = () => {
  const dashboardNavigator = useStateNavigator();
  const trackNavigator = useStateNavigator();
  const analyticsNavigator = useStateNavigator();
  const planNavigator = useStateNavigator();
  const moreNavigator = useStateNavigator();

  return (
    <>
      <NavigationBar hidden={true} />
      <TabBar
        primary={true}
        barTintColor="#040404"
        selectedTintColor="#3b82f6"
        activeIndicatorColor="#3b82f630"
        unselectedTintColor="#ffffff"
        preventFouc={true}
        labelVisibilityMode="labeled"
      >
        <TabBarItem title="Hub" image={require('../assets/navigation/dashboard.png')}>
          <NavigationHandler stateNavigator={dashboardNavigator}>
            <NavigationStack
              underlayColor="#030303"
              backgroundColor={() => '#0a0a0a'}
              crumbStyle={[
                { type: 'alpha', start: 0.7, duration: 300 },
                { type: 'scale', startX: 1.05, startY: 1.05, duration: 300 },
              ]}
              unmountStyle={[
                { type: 'alpha', start: 0, duration: 300 },
                { type: 'scale', startX: 0.95, startY: 0.95, duration: 300 },
              ]}
            >
              <Scene stateKey="hub">
                <HubScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>

        <TabBarItem title="Track" image={require('../assets/navigation/transaction.png')}>
          <NavigationHandler stateNavigator={trackNavigator}>
            <NavigationStack
              underlayColor="#030303"
              backgroundColor={() => '#0a0a0a'}
              crumbStyle={[
                { type: 'alpha', start: 0.7, duration: 300 },
                { type: 'scale', startX: 1.05, startY: 1.05, duration: 300 },
              ]}
              unmountStyle={[
                { type: 'alpha', start: 0, duration: 300 },
                { type: 'scale', startX: 0.95, startY: 0.95, duration: 300 },
              ]}
            >
              <Scene stateKey="transactions">
                <TransactionsScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>

        <TabBarItem title="Analytics" image={require('../assets/navigation/analytics.png')}>
          <NavigationHandler stateNavigator={analyticsNavigator}>
            <NavigationStack
              underlayColor="#030303"
              backgroundColor={() => '#0a0a0a'}
              crumbStyle={[
                { type: 'alpha', start: 0.7, duration: 300 },
                { type: 'scale', startX: 1.05, startY: 1.05, duration: 300 },
              ]}
              unmountStyle={[
                { type: 'alpha', start: 0, duration: 300 },
                { type: 'scale', startX: 0.95, startY: 0.95, duration: 300 },
              ]}
            >
              <Scene stateKey="analytics">
                <AnalyticsScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>

        <TabBarItem title="Plan" image={require('../assets/navigation/plan.png')}>
          <NavigationHandler stateNavigator={planNavigator}>
            <NavigationStack
              underlayColor="#030303"
              backgroundColor={() => '#0a0a0a'}
              crumbStyle={[
                { type: 'alpha', start: 0.7, duration: 300 },
                { type: 'scale', startX: 1.05, startY: 1.05, duration: 300 },
              ]}
              unmountStyle={[
                { type: 'alpha', start: 0, duration: 300 },
                { type: 'scale', startX: 0.95, startY: 0.95, duration: 300 },
              ]}
            >
              <Scene stateKey="plan">
                <PlanScreen />
              </Scene>
              <Scene stateKey="budgets">
                <BudgetsScreen />
              </Scene>
              <Scene stateKey="goals">
                <GoalsScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>

        <TabBarItem title="More" image={require('../assets/navigation/more.png')}>
          <NavigationHandler stateNavigator={moreNavigator}>
            <NavigationStack
              underlayColor="#030303"
              backgroundColor={() => '#0a0a0a'}
              crumbStyle={[
                { type: 'alpha', start: 0.7, duration: 300 },
                { type: 'scale', startX: 1.05, startY: 1.05, duration: 300 },
              ]}
              unmountStyle={[
                { type: 'alpha', start: 0, duration: 300 },
                { type: 'scale', startX: 0.95, startY: 0.95, duration: 300 },
              ]}
            >
              <Scene stateKey="more">
                <MoreScreen />
              </Scene>
            </NavigationStack>
          </NavigationHandler>
        </TabBarItem>
      </TabBar>
    </>
  );
};

export const MainNavigator = () => {
  return (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack>
        <Scene stateKey="welcome">
          <WelcomeScreen />
        </Scene>
        <Scene stateKey="tabs">
          <Tabs />
        </Scene>
      </NavigationStack>
    </NavigationHandler>
  );
};
