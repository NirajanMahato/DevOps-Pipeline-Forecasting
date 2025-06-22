# Machine Learning-Based Resource Utilization Forecasting for DevOps Pipelines

This project is a thesis focused on using machine learning to predict the resource utilization (specifically, job duration) of CI/CD pipelines. The goal is to build a model that can accurately forecast how long a given test suite or job will take to run, enabling smarter scheduling and resource allocation in a DevOps environment.

## Current Status

The project currently consists of a Jupyter Notebook (`DevOps_Pipeline_Forecasting.ipynb`) that performs the following steps:

1.  Downloads and cleans a public dataset of CI/CD job runs from the Ruby on Rails project.
2.  Performs exploratory data analysis (EDA) to understand the data.
3.  Engineers features, including time-based features and categorical features for the test suite names.
4.  Trains a LightGBM gradient boosting model to predict the duration of test suites.
5.  Achieves an R-squared of ~0.75, indicating a good predictive performance on the test set.

## Next Steps

The future work for this thesis is outlined in the notebook and includes:

- Advanced feature engineering using git metadata.
- Model refinement and hyperparameter tuning.
- Development of a web-based dashboard to visualize the data and model predictions.

## Running the Notebook

1.  Ensure you have Python and Jupyter Notebook installed.
2.  Open `DevOps_Pipeline_Forecasting.ipynb`.
3.  Run the cells sequentially. The notebook will automatically download the required dataset and install necessary Python packages.
