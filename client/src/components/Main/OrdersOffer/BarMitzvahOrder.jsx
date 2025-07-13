import React, { useEffect, useState } from "react";
import {
  Box,

  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Container,
  Button,
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";
import NavbarHome from "../NavbarHome";
import Footer from "../Footer";
import Grid from '@mui/material/Grid2';
const BarMitzvahOrder = () => {
  const [inventoryAll, setInventoryAll] = useState({
    first_courses: [],
    main_courses: [],
    salads: [],
    side_dishes: [],
  });

  const [selectedSalads, setSelectedSalads] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);
  const [selectedMainDishes, setSelectedMainDishes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryAll = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/inventoryAll");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        setInventoryAll(data);
      } catch (error) {
        setErrorMessage("שגיאה בטעינת המנות");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryAll();
  }, []);

  const handleOrderSummaryClick = () => {
    console.log("סלטים:", selectedSalads);
    console.log("מנות ראשונות:", selectedFirstDishes);
    console.log("מנות עיקריות:", selectedMainDishes);
    console.log("תוספות:", selectedSides);
  };

  const renderCategory = (title, items, selectedItems, setSelectedItems, maxSelection) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #ccc', pb: 1 }}>
        {title} [{maxSelection} לבחירה]
      </Typography>

      <Grid container spacing={2}>
        {items.filter(d => d.is_hidden).map((dish) => {
          const isChecked = selectedItems.includes(dish.id);
          const isDisabled = !isChecked && selectedItems.length >= maxSelection;

          return (
            <Grid  size={{ xs: 12, sm: 4 }} key={dish.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "100%",
                  backgroundColor: isChecked ? "#e0f7fa" : "#fff",
                  transition: "background-color 0.3s",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="medium"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={(e) => {
                        const id = dish.id;
                        setSelectedItems((prev) =>
                          e.target.checked
                            ? [...prev, id]
                            : prev.filter((s) => s !== id)
                        );
                      }}
                    />
                  }
                  label={<Typography fontSize={16}>{dish.dish_name}</Typography>}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <>
      <NavbarHome />
      <Container dir="rtl" maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Banner Image */}
        <Box sx={{ mb: 4 }}>
          <img
            src="https://images.unsplash.com/photo-1594633314897-1156a5d95d9b"
            alt="בר מצווה"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            תפריט בר מצווה
          </Typography>
          <Typography variant="h6" color="text.secondary">
            קייטרינג הפנינה - כשר למהדרין
          </Typography>
          <Typography variant="body1" color="text.secondary">
            054-6600-200 | eli6600200@gmail.com
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ width: "100%", mb: 2 }}>
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

        {/* Menu Categories */}
        {renderCategory("סלטים", inventoryAll.salads, selectedSalads, setSelectedSalads, 8)}
        {renderCategory("מנות ראשונות", inventoryAll.first_courses, selectedFirstDishes, setSelectedFirstDishes, 3)}
        {renderCategory("מנות עיקריות", inventoryAll.main_courses, selectedMainDishes, setSelectedMainDishes, 3)}
        {renderCategory("תוספות", inventoryAll.side_dishes, selectedSides, setSelectedSides, 3)}

        {/* Submit Button */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleOrderSummaryClick}
            sx={{ px: 6, py: 1.5, fontSize: "18px", borderRadius: "30px" }}
          >
            סיכום הזמנה
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default BarMitzvahOrder;
