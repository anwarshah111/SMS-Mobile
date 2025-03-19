import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$9.99',
      period: 'per month',
      features: [
        'Full access to all features',
        'Cancel anytime',
        'New content weekly',
      ],
      popularTag: false,
      gradient: ['#3A7BD5', '#00D2FF'],
    },
    {
      id: 'yearly',
      title: 'Yearly',
      price: '$99.99',
      period: 'per year',
      features: [
        'Full access to all features',
        'Cancel anytime',
        'New content weekly',
        '17% savings vs monthly',
      ],
      popularTag: true,
      gradient: ['#6441A5', '#2a0845'],
    },
    {
      id: 'lifetime',
      title: 'Lifetime',
      price: '$249.99',
      period: 'one-time payment',
      features: [
        'Full access to all features',
        'Never pay again',
        'Free updates forever',
        'Premium support',
      ],
      popularTag: false,
      gradient: ['#FF4E50', '#F9D423'],
    },
  ];

  const renderPlanCard = plan => (
    <TouchableOpacity
      key={plan.id}
      style={[styles.planCard, selectedPlan === plan.id && styles.selectedPlan]}
      onPress={() => setSelectedPlan(plan.id)}
      activeOpacity={0.9}>
      <LinearGradient
        colors={plan.gradient}
        style={styles.gradientHeader}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.subsContainer}>
          {plan.popularTag && (
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>Most Popular</Text>
            </View>
          )}
          <Text style={styles.planTitle}>{plan.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Icon
              name="check-circle"
              size={20}
              color="#6441A5"
              style={styles.checkIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the perfect subscription plan for you
          </Text>
        </View>

        <View style={styles.plansContainer}>{plans.map(renderPlanCard)}</View>

        <TouchableOpacity
          style={styles.subscribeButton}
          activeOpacity={0.8}
          onPress={() => console.log(`Subscribing to ${selectedPlan} plan`)}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription anytime from your account settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // overflow: 'hidden',
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#6441A5',
  },
  gradientHeader: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  subsContainer: {
    padding: 20,
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  period: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  featuresContainer: {
    padding: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  popularTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  popularTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#6441A5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubscriptionScreen;
