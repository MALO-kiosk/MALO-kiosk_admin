import React from 'react';
import './css/HomePreviewFrame.css';
import CommonMenuSelectScreen from './common-menu-select/CommonMenuSelectScreen';
import CommonOptionScreen from './common-option/CommonOptionScreen';
import CommonCustomOptionScreen from './common-custom-option/CommonCustomOptionScreen';

function MenuPreview({
  menuItems,
  selectedMenu,
  activePrimaryCategory,
  activeCoffeeDetailCategory,
  onPrimaryCategoryChange,
  onCoffeeDetailCategoryChange,
}) {
  return (
    <div className="hp-frame menu-preview">
      <div className="hp-menu-preview-wrapper">
        <div className="hp-stage-canvas">
          <CommonMenuSelectScreen
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            activePrimaryCategory={activePrimaryCategory}
            activeCoffeeDetailCategory={activeCoffeeDetailCategory}
            onPrimaryCategoryChange={onPrimaryCategoryChange}
            onCoffeeDetailCategoryChange={onCoffeeDetailCategoryChange}
          />
        </div>
      </div>
    </div>
  );
}

function OptionPreview({ variant, refreshKey }) {
  return (
    <div className="hp-frame option-preview">
      <div className="hp-menu-preview-wrapper">
        <div className="hp-stage-canvas">
          {variant === 'custom' ? (
            <CommonCustomOptionScreen refreshKey={refreshKey} />
          ) : (
            <CommonOptionScreen />
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePreviewFrame({
  view = 'menu',
  variant = 'basic',
  menuItems,
  selectedMenu,
  activePrimaryCategory,
  activeCoffeeDetailCategory,
  onPrimaryCategoryChange,
  onCoffeeDetailCategoryChange,
  refreshKey = 0,
}) {
  if (view === 'menu') {
    return (
      <MenuPreview
        menuItems={menuItems}
        selectedMenu={selectedMenu}
        activePrimaryCategory={activePrimaryCategory}
        activeCoffeeDetailCategory={activeCoffeeDetailCategory}
        onPrimaryCategoryChange={onPrimaryCategoryChange}
        onCoffeeDetailCategoryChange={onCoffeeDetailCategoryChange}
      />
    );
  }
  return <OptionPreview variant={variant} refreshKey={refreshKey} />;
}
