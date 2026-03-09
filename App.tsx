import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';
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

  // 点击加一，并持久化
  const handleIncrement = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      saveCount(next);
      return next;
    });
  }, []);

  if (!ready) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={[styles.counterValue, { color: theme.text }]}>0</Text>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.textMuted }]}>
          当前计数值
        </Text>
        <Text style={[styles.counterValue, { color: theme.text }]}>{count}</Text>
      </View>

      <Pressable
        onPress={handleIncrement}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.buttonBg,
            borderColor: theme.accentBorder,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          +1 点击加一
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
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
  },
});
