import React, { useState, useEffect } from "react";
import { Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import './EngagementOrder.css'; // נניח שיש קובץ CSS

const EngagementOrder = () => {
  const [inventoryAll, setInventoryAll] = useState({
    first_courses: [],
    main_courses: [],
    salads: [],
    side_dishes: [],
  });

  useEffect(() => {
    const fetchInventoryAll = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/inventoryAll");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setInventoryAll(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };
    fetchInventoryAll();
  }, []);

  const [selectedSalads, setSelectedSalads] = useState([]);
  const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);
  const [selectedMainDishes, setSelectedMainDishes] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const loading = false;

  const handleOrderSummaryClick = () => {
    console.log("סלטים:", selectedSalads);
    console.log("מנות ראשונות:", selectedFirstDishes);
    console.log("מנות עיקריות:", selectedMainDishes);
    console.log("תוספות:", selectedSides);
  };

  const renderCategory = (title, items, selected, setSelected, max) => (
    <div className="menu-category">
      <h3>{title} [{max} לבחירה]</h3>
      <div className="menu-grid">
        {items.map((item) => {
          const isChecked = selected.includes(item.id);
          const isDisabled = !isChecked && selected.length >= max;
          return (
            <div key={item.id} className="menu-card">
              <span className="dish-name">{item.dish_name}</span>
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => {
                  if (isChecked) {
                    setSelected(prev => prev.filter(id => id !== item.id));
                  } else if (!isDisabled) {
                    setSelected(prev => [...prev, item.id]);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="online-order-container">
      <div className="order-header">
        <h2 className="order-header-title">תפריט אירוסין</h2>
        <p className="order-subtitle">5 סלטים לבחירה | מינימום הזמנה: 30 איש</p>
      </div>

      <div dir="rtl" className="menu-container">
        {loading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>

        {renderCategory(
          "סלטים",
          inventoryAll.salads.filter(item => item.is_hidden),
          selectedSalads,
          setSelectedSalads,
          5
        )}

        {renderCategory(
          "מנות ראשונות",
          inventoryAll.first_courses.filter(item => item.is_hidden),
          selectedFirstDishes,
          setSelectedFirstDishes,
          3
        )}

        {renderCategory(
          "מנות עיקריות",
          inventoryAll.main_courses.filter(item => item.is_hidden),
          selectedMainDishes,
          setSelectedMainDishes,
          3
        )}

        {renderCategory(
          "תוספות",
          inventoryAll.side_dishes.filter(item => item.is_hidden),
          selectedSides,
          setSelectedSides,
          3
        )}

        <div className="order-summary-container">
          <button onClick={handleOrderSummaryClick} className="order-summary-button">
            סיכום הזמנה
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngagementOrder;
