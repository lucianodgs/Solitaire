import React, { useState } from 'react';

interface MenuBarProps {
  onNewGame: () => void;
  onToggleDrawMode: () => void;
  drawMode: 1 | 3;
}

interface MenuItem {
  label: string;
  action?: () => void;
  separator?: boolean;
  checked?: boolean;
}

interface Menu {
  label: string;
  items: MenuItem[];
}

const MenuBar: React.FC<MenuBarProps> = ({ onNewGame, onToggleDrawMode, drawMode }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Menu[] = [
    {
      label: 'Game',
      items: [
        { label: 'New Game', action: onNewGame },
        { separator: true, label: '' },
        { label: 'Draw One', checked: drawMode === 1, action: onToggleDrawMode },
        { label: 'Draw Three', checked: drawMode === 3, action: onToggleDrawMode },
        { separator: true, label: '' },
        { label: 'Exit', action: () => window.location.reload() },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'How to Play', action: () => alert('Build foundations A to K by suit. Build tableau K to A alternating colors.') },
        { separator: true, label: '' },
        { label: 'About Solitaire', action: () => alert('Windows 3.11 Solitaire Clone\nBuilt with React + TypeScript') },
      ],
    },
  ];

  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.action && !item.separator) {
      item.action();
    }
    setActiveMenu(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#c0c0c0',
        borderBottom: '2px solid #808080',
        padding: '2px 4px',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
        fontSize: '11px',
        userSelect: 'none',
      }}
    >
      {menus.map((menu) => (
        <div key={menu.label} style={{ position: 'relative' }}>
          <button
            onClick={() => handleMenuClick(menu.label)}
            style={{
              padding: '2px 8px',
              backgroundColor: activeMenu === menu.label ? '#000080' : 'transparent',
              color: activeMenu === menu.label ? '#ffffff' : '#000000',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {menu.label}
          </button>

          {activeMenu === menu.label && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#c0c0c0',
                borderTop: '2px solid #ffffff',
                borderLeft: '2px solid #ffffff',
                borderRight: '2px solid #808080',
                borderBottom: '2px solid #808080',
                zIndex: 1000,
                minWidth: '120px',
              }}
            >
              {menu.items.map((item, index) => (
                item.separator ? (
                  <div
                    key={index}
                    style={{
                      height: '2px',
                      backgroundColor: '#808080',
                      margin: '4px 0',
                      borderTop: '1px solid #ffffff',
                    }}
                  />
                ) : (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      textAlign: 'left',
                      color: '#000000',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000080';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#000000';
                    }}
                  >
                    <span style={{ width: '16px', marginRight: '4px' }}>
                      {item.checked ? '✓' : ''}
                    </span>
                    {item.label}
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      ))}

      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default MenuBar;
