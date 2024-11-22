import {
  X,
  Maximize2,
  PanelLeft,
  Settings,
  SendHorizontal,
  CircleX,
  CircleCheck,
} from 'lucide-react';
import styles from './Buttons.module.css';

type IconButtonProps = {
  onClick?: () => void;
};

// BUTTONS:

const XButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    <X strokeWidth="1.25px" />
  </button>
);

const PanelLeftButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    <PanelLeft strokeWidth="1.25px" />
  </button>
);

const MaximizeButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    <Maximize2 strokeWidth="1.25px" />
  </button>
);

const SettingsButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    <Settings strokeWidth="1.25px" />
  </button>
);

const SendButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.button} onClick={onClick}>
    <SendHorizontal strokeWidth="1.25px" />
  </button>
);

const ConfirmEditButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.editButton} onClick={onClick}>
    <CircleCheck strokeWidth="1.25px" />
  </button>
);

const DiscardEditButton = ({ onClick }: IconButtonProps) => (
  <button className={styles.editButton} onClick={onClick}>
    <CircleX strokeWidth="1.25px" />
  </button>
);

export {
  XButton,
  PanelLeftButton,
  MaximizeButton,
  SettingsButton,
  SendButton,
  ConfirmEditButton,
  DiscardEditButton,
};
