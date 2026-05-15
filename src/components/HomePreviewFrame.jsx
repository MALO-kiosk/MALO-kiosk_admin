import React from 'react';
import './css/HomePreviewFrame.css';
import CommonMenuSelectScreen from './common-menu-select/CommonMenuSelectScreen';
import CommonOptionScreen from './common-option/CommonOptionScreen';
import CommonCustomOptionScreen from './common-custom-option/CommonCustomOptionScreen';

function MenuPreview({ menuItems, selectedMenu }) {
  return (
    <div className="hp-frame menu-preview">
      <div className="hp-menu-preview-wrapper">
        <div className="hp-stage-canvas">
          <CommonMenuSelectScreen menuItems={menuItems} selectedMenu={selectedMenu} />
        </div>
      </div>
    </div>
  );
}

function OptionPreview({ variant }) {
  return (
    <div className="hp-frame option-preview">
      <div className="hp-menu-preview-wrapper">
        <div className="hp-stage-canvas">
          {variant === 'custom' ? (
            <CommonCustomOptionScreen />
          ) : (
            <CommonOptionScreen />
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePreviewFrame({ view = 'menu', variant = 'basic', menuItems, selectedMenu }) {
  if (view === 'menu') return <MenuPreview menuItems={menuItems} selectedMenu={selectedMenu} />;
  return <OptionPreview variant={variant} />;
}
