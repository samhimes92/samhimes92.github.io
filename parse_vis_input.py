import os
import pandas as pd
import numpy as np

PATH_TO_PAIRWISE_FILES = "./vis_data/pairwise_res/"
PATH_TO_EMPIRICAL_FILES = "./vis_data/emp_res/"
PATH_TO_RESULTS = "./vis_data"


final_df = pd.DataFrame()

count = 0
for file_name in os.listdir(PATH_TO_EMPIRICAL_FILES):
    if file_name.endswith(".csv"):
        count+=1

        cur_path = PATH_TO_EMPIRICAL_FILES + file_name
        cur_csv = pd.read_csv(cur_path)
        cur_run = file_name.split("__")[0]

        filter_cols = ["controls", "architecture"]
        statistic_cols = []
        for col in cur_csv:
            if col.startswith("statistic"):
                filter_cols.append(col)
                statistic_cols.append(col)

        cur_csv = cur_csv[filter_cols]

        for col in cur_csv.columns:
            if col != "controls" and col != "architecture":
                treatment = col.split("_")[1]
                treatment = treatment.replace(" ", "_")
                cur_name = f"alpha__{treatment}__{cur_run}"
                cur_csv.rename(columns={col: cur_name}, inplace=True)

        if count == 1:
            final_df = cur_csv
        else:
            final_df = final_df.merge(cur_csv, how="outer", on="architecture")

for file_name in os.listdir(PATH_TO_PAIRWISE_FILES):
    if not "__missing_architectures" in file_name and file_name.endswith(".csv"):
        base_treatment, base_run = file_name.replace(".csv","").split("_vs_")[0].split("__")
        stim_treatment, stim_run = file_name.replace(".csv","").split("_vs_")[1].split("__")

        cur_path = PATH_TO_PAIRWISE_FILES + file_name
        cur_csv = pd.read_csv(cur_path)
        cur_csv[['motif', 'not']] = cur_csv['architecture'].str.split(":", expand=True)


        ranked_df = cur_csv[["logFC", "statistic", "architecture", "motif", "fdr", "df.dna"]]


        summary_df = ranked_df[ranked_df['fdr'] <= .05] 
        summary_df = summary_df.groupby('motif')['logFC'].agg(lambda x: np.nanmax(np.abs(x)))
        summary_df = summary_df.to_frame().reset_index()
        summary_df = summary_df.rename(columns={'logFC': 'max'})
        summary_df['max_rank'] = summary_df['max'].rank(method='max', ascending = False)
        ranked_df = pd.merge(ranked_df,summary_df, how='left', on='motif')

        barcode_offset = ranked_df["df.dna"].max() - 100
        ranked_df["df.dna"] -= barcode_offset


        ranked_df = ranked_df[["logFC", "statistic", "architecture", "max", "max_rank", "fdr", "df.dna"]]

        n_barcodes = f"n_barcodes__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"

        fdr_new = f"fdr__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"
        statistic_new = f"statistic__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"
        logFC_new = f"logFC__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"
        max_new = f"max__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"
        max_rank_new = f"maxRank__{base_treatment}__{base_run}_vs_{stim_treatment}__{stim_run}"


        ranked_df.rename(columns={"df.dna": n_barcodes,"fdr": fdr_new, "logFC": logFC_new, "max_rank": max_rank_new,"max": max_new, "statistic": statistic_new}, inplace = True)

        final_df = final_df.merge(ranked_df, how="outer", on="architecture")


final_df[['motif', 'not']] = final_df['architecture'].str.split(":", expand=True)
final_df.drop(['not'], axis=1)

final_df["controls"] = final_df["controls_x"]
final_df=final_df.drop(['controls_x'], axis=1)
final_df=final_df.drop(['controls_y'], axis=1)
final_df=final_df.drop(['not'], axis=1)
final_df.to_csv(f"./{PATH_TO_RESULTS}/current_runs.csv")


