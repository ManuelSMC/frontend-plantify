import React from "react";
import { styles } from "../styles/UsuariosStyles";

function ToggleSwitch({ checked, onChange }) {
  return (
    <label style={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={styles.input}
      />
      <span
        style={{
          ...styles.slider,
          ...(checked ? styles.inputChecked : {}),
        }}
      >
        <span
          style={{
            ...styles.sliderBefore,
            ...(checked ? styles.sliderCheckedBefore : {}),
          }}
        ></span>
      </span>
    </label>
  );
}

export default ToggleSwitch;
