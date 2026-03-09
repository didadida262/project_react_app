import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const COUNTER_STORAGE_KEY = '@counter_value';

/** 从本地存储读取计数值，无则返回 0 */
async function loadStoredCount(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(COUNTER_STORAGE_KEY);
    return value != null ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

/** 将计数值写入本地存储 */
async function saveCount(count: number): Promise<void> {
  try {
    await AsyncStorage.setItem(COUNTER_STORAGE_KEY, String(count));
  } catch {
    // 忽略存储错误，仅内存计数
  }
}

// Aceternity 风格色彩：深色背景 + 青色强调
const colors = {
  light: {
    bg: '#fafafa',
    card: '#ffffff',
    text: '#18181b',
    textMuted: '#71717a',
    accent: '#0891b2',
    accentBorder: '#06b6d4',
    buttonBg: '#0891b2',
    buttonText: '#ffffff',
  },
  dark: {
    bg: '#09090b',
    card: '#18181b',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    accent: '#22d3ee',
    accentBorder: '#67e8f9',
    buttonBg: '#0e7490',
    buttonText: '#f0fdfa',
  },
} as const;

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // 启动时从本地恢复计数值
  useEffect(() => {
    let cancelled = false;
    loadStoredCount().then((value) => {
      if (!cancelled) {
        setCount(value);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 数字抖动动画（加一时触发）
  const runShake = useCallback(() => {
    const duration = 45;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -12, duration, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  // 点击加一，并持久化 + 抖动
  const handleIncrement = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      saveCount(next);
      return next;
    });
    runShake();
  }, [runShake]);

  // 清零并持久化
  const handleReset = useCallback(() => {
    setCount(0);
    saveCount(0);
  }, []);

  // 炫酷渐变背景色（深紫 → 深蓝 → 青）；浅色模式也做明显渐变便于手机端可见
  const gradientColors: readonly [string, string, ...string[]] =
    colorScheme === 'dark'
      ? ['#0f0a1f', '#1a0a2e', '#0c1929', '#0e7490']
      : ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8'];

  const fallbackBg = colorScheme === 'dark' ? '#0f0a1f' : '#e0e7ff';

  if (!ready) {
    return (
      <View style={[styles.container, { backgroundColor: fallbackBg }]}>
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.4, 0.7, 1]}
        />
        <View style={styles.overlay}>
          <Text selectable={false} style={[styles.counterValue, { color: theme.text }]}>
            0
          </Text>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: fallbackBg }]}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 0.7, 1]}
      />
      <View style={styles.overlay}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <Text selectable={false} style={[styles.label, { color: theme.textMuted }]}>
          当前计数值
        </Text>
        <Text selectable={false} style={[styles.counterValue, { color: theme.text }]}>
          {count}
        </Text>
      </Animated.View>

      <View style={styles.buttons}>
        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary,
            {
              backgroundColor: theme.buttonBg,
              borderColor: theme.accentBorder,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text selectable={false} style={[styles.buttonText, { color: theme.buttonText }]}>
            计数
          </Text>
        </Pressable>
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.button,
            styles.buttonReset,
            {
              borderColor: theme.textMuted,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <Text selectable={false} style={[styles.buttonText, { color: theme.textMuted }]}>
            Reset
          </Text>
        </Pressable>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttons: {
    gap: 12,
    alignItems: 'center',
  },
  buttonPrimary: {},
  buttonReset: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  counterValue: {
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -2,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    ...(Platform.OS === 'web' && { userSelect: 'none' } as const),
  },
});
