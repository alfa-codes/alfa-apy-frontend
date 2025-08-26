import React from 'react';
import clsx from 'clsx';

// Импортируем CSS для иконок
import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
import './icon.css';

interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'regular' | 'solid';
  style?: React.CSSProperties;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export function Icon({ name, className, size = 'md', variant = 'regular', style }: IconProps) {
  const iconClass = variant === 'solid' ? `hn-${name}-solid` : `hn-${name}`;
  
  return (
    <i 
      className={clsx(
        'hn',
        iconClass,
        sizeClasses[size],
        className
      )}
      style={{ color: 'inherit', ...style }} // Наследуем цвет от родителя и добавляем переданный style
    />
  );
}

// Предопределенные иконки для удобства
export const Icons = {
  // Стрелки и навигация
  arrowUp: 'arrow-up',
  arrowDown: 'arrow-down',
  arrowLeft: 'arrow-left',
  arrowRight: 'arrow-right',
  arrowCircleUp: 'arrow-circle-up',
  arrowCircleDown: 'arrow-circle-down',
  arrowCircleLeft: 'arrow-circle-left',
  arrowCircleRight: 'arrow-circle-right',
  arrowsCounterclockwise: 'arrows-counterclockwise',
  
  // Чек и успех
  check: 'check',
  checkCircle: 'check-circle',
  checkBox: 'check-box',
  badgeCheck: 'badge-check',
  octagonCheck: 'octagon-check',
  
  // Графики и аналитика
  chartLine: 'chart-line',
  chartNetwork: 'chart-network',
  viewblocks: 'viewblocks',
  
  // Безопасность
  lock: 'lock',
  lockAlt: 'lock-alt',
  lockOpen: 'lock-open',
  
  // Деньги и финансы
  bank: 'bank',
  bankSolid: 'bank-solid',
  wallet: 'wallet',
  walletSolid: 'wallet-solid',
  boxUsd: 'box-usd',
  boxUsdSolid: 'box-usd-solid',
  moneyWithWings: 'wallet', // Используем wallet как money with wings
  
  // Звезды и украшения
  star: 'star',
  starSolid: 'star-solid',
  starCrescent: 'star-crescent',
  starCrescentSolid: 'star-crescent-solid',
  
  // Время и процессы
  clock: 'clock',
  
  // Управление
  management: 'management',
  productManagement: 'product-management',
  startups: 'startups',
  
  // Код и блоки
  codeBlock: 'code-block',
  
  // Флаги
  flagCheckered: 'flag-checkered',
  
  // Пользователи
  user: 'user',
  userCheck: 'user-check',
  userHeadset: 'user-headset',
  users: 'users',
  usersCrown: 'users-crown',
  
  // Обновление и синхронизация
  refresh: 'refresh'
};
