import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

export default function App() {
  // 預設時間 25 分鐘 = 25 * 60 秒
  const INITIAL_TIME = 25 * 60;
  
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  
  const intervalRef = useRef(null);

  // 格式化時間顯示為 MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 倒數計時邏輯
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // 計時結束，進入休息時間
      setIsBreakTime(true);
      setIsRunning(false);
    }

    // 清理函數：清除 interval 防止記憶體洩漏
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // 開始/暫停按鈕
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  // 重置按鈕
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
    setIsBreakTime(false);
  };

  // 背景顏色：淺紅色（專注模式）vs 綠色（休息時間）
  const backgroundColor = isBreakTime ? '#90EE90' : '#FFB6C1';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      
      <Text style={styles.title}>
        {isBreakTime ? '休息時間！(Break Time)' : '番茄鐘計時器'}
      </Text>
      
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.startPauseButton]} 
          onPress={handleStartPause}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '暫停 (Pause)' : '開始 (Start)'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>重置 (Reset)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  timer: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 60,
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
  },
  startPauseButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
