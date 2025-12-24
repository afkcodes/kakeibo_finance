/**
 * @fileoverview SkeletonLoader component
 * @module @kakeibo/native/components/ui
 *
 * Loading skeleton with shimmer animation.
 */

import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export interface SkeletonLoaderProps {
  /** Skeleton variant */
  variant?: 'text' | 'card' | 'list';

  /** Number of items for list variant */
  count?: number;
}

/**
 * SkeletonLoader component
 *
 * @example
 * <SkeletonLoader variant="card" />
 * <SkeletonLoader variant="list" count={3} />
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'text', count = 1 }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderTextSkeleton = () => (
    <Animated.View className="bg-surface-700 rounded h-4 w-full" style={{ opacity }} />
  );

  const renderCardSkeleton = () => (
    <View className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4 space-y-3">
      <View className="flex-row items-center gap-3">
        <Animated.View className="w-10 h-10 rounded-lg bg-surface-700" style={{ opacity }} />
        <View className="flex-1 space-y-2">
          <Animated.View className="bg-surface-700 rounded h-4 w-3/4" style={{ opacity }} />
          <Animated.View className="bg-surface-700 rounded h-3 w-1/2" style={{ opacity }} />
        </View>
      </View>
      <Animated.View className="bg-surface-700 rounded h-2 w-full" style={{ opacity }} />
    </View>
  );

  if (variant === 'text') {
    return renderTextSkeleton();
  }

  if (variant === 'card') {
    return renderCardSkeleton();
  }

  if (variant === 'list') {
    return (
      <View className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <View key={index}>{renderCardSkeleton()}</View>
        ))}
      </View>
    );
  }

  return null;
};
