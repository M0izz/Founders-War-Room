import React from 'react';
import {
  Landmark,
  Cpu,
  Megaphone,
  Crown,
  DollarSign,
  Skull,
  UserCheck,
  Shield,
  Lightbulb,
  Swords,
  TrendingUp,
  Medal,
  Rocket,
  Search,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Flame,
  Zap,
  History,
  X,
  Sparkles,
  BarChart3,
  Tv,
  Bot,
  Target,
  ShieldAlert,
  User,
  Check,
  Clock,
  Layers,
} from 'lucide-react';

const ICON_MAP = {
  // Emojis mapping
  '🏛️': Landmark,
  '🏛': Landmark,
  '⚙️': Cpu,
  '📢': Megaphone,
  '👑': Crown,
  '💰': DollarSign,
  '💀': Skull,
  '🧑‍💻': UserCheck,
  '👤': User,
  '🛡️': Shield,
  '💡': Lightbulb,
  '⚔️': Swords,
  '📈': TrendingUp,
  '🎖️': Medal,
  '🚀': Rocket,
  '🔍': Search,
  '⚖️': Scale,
  '✅': CheckCircle2,
  '⚠️': AlertTriangle,
  '🚨': AlertTriangle,
  '⚰️': Skull,
  '📋': FileText,
  '📝': FileText,
  '📜': History,
  '⚡': Zap,
  '🔥': Flame,
  '🦈': Flame,
  '🎬': Tv,
  '📊': BarChart3,
  '👔': Landmark,
  '🎯': Target,
  '🤖': Bot,
  '✖': X,
  '🪑': Layers,

  // Text keys
  ceo: Landmark,
  cto: Cpu,
  marketing: Megaphone,
  chairman: Crown,
  investor: DollarSign,
  reaper: Skull,
  customer: UserCheck,
  risk: ShieldAlert,
  idea: Lightbulb,
  debate: Swords,
  improve: TrendingUp,
  approve: Medal,
  build: Rocket,
  analyzing: Search,
  deciding: Scale,
  validating: CheckCircle2,
  history: History,
  close: X,
  check: Check,
  warning: AlertTriangle,
};

export default function AppIcon({ name, emoji, className = '', size = 20, color, style }) {
  const IconComponent = ICON_MAP[name] || ICON_MAP[emoji] || Sparkles;
  return (
    <IconComponent
      className={`app-icon ${className}`}
      size={size}
      color={color}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    />
  );
}
