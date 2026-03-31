'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function Counter({
  end,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const animateCounter = useCallback(() => {
    const startTime = performance.now();
    const range = end - start;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = start + range * easedProgress;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, start, duration]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasAnimated, animateCounter]);

  const formatNumber = (num: number): string => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.round(num).toLocaleString();
  };

  return (
    <span ref={ref} className={`counter-number ${className}`}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

// Animated stat card component
interface AnimatedStatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  duration?: number;
  className?: string;
}

export function AnimatedStat({
  value,
  label,
  prefix = '',
  suffix = '',
  description,
  duration = 2000,
  className = '',
}: AnimatedStatProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="font-poppins text-3xl font-bold text-navy lg:text-4xl">
        <Counter end={value} prefix={prefix} suffix={suffix} duration={duration} />
      </p>
      <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
