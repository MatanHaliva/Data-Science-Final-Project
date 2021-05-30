from flask_restx.fields import Integer
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

class FaceClustering:

    def __init__(self):
        self.faces = []

    def get_best_pca_dimensions(self, data, threshold_variance: int = 90) -> int:

        print("\n-------------------- get_best_pca_dimensions --------------------\n")

        n_components: int = min(len(data), len(data[0]))
        pca = PCA(n_components=n_components)
        pca.fit(data)
        variance = pca.explained_variance_ratio_
        var = np.cumsum(np.round(variance, 3)*100)
        best_pca_dimensions = next(item[0] for item in enumerate(var) if item[1] > threshold_variance)

        print("best_pca_dimensions for", threshold_variance, "% Variance is: ", best_pca_dimensions, "Features\n")

        return best_pca_dimensions

    def create_pca(self, faces: pd.DataFrame, face_encodings: list, n_components: int=20):

        print("\n------------------------- create_pca ------------------------------\n")

        pca = PCA(n_components=n_components)
        pca.fit(face_encodings)

        pca_scale = pca.transform(face_encodings)
        pca_df = pd.DataFrame(pca_scale)

        pca_df_all_data = pd.DataFrame()
        pca_df_all_data['face_location'] = faces.face_location
        pca_df_all_data['image_path'] = faces.image_path
        pca_df_all_data['face_encoding'] = face_encodings
        pca_df_all_data['accuracy'] = faces.accuracy

        return pca_df_all_data, pca_df

    def get_optimal_parameters(self, data: pd.DataFrame, eps_start_index: int, eps_end_index: int, eps_step: float, min_pts_start_index: int, min_pts_end_index: int):

        no_of_clusters = []
        sil_scores = []
        eps_values = []
        min_pts_values = []
        counter = 0

        for eps in np.arange(eps_start_index, eps_end_index, eps_step):
            for min_pts in np.arange(min_pts_start_index, min_pts_end_index):

                labels, sil_score = self.start_dbscan(
                    data, eps=eps, min_samples=min_pts)
                
                counter += 1

                if sil_score is not None:
                    print("min_pts", min_pts, "eps", eps, "sil_score", sil_score, "counter", counter)
                    eps_values.append(eps)
                    min_pts_values.append(min_pts)
                    no_of_clusters.append(len(np.unique(labels)))
                    sil_scores.append(sil_score)

        all_dbscan_results = list(
            zip(no_of_clusters, sil_scores, eps_values, min_pts_values))
        all_dbscan_results_df = pd.DataFrame(all_dbscan_results, columns=[
                                             'no_of_clusters', 'silhouette_score', 'epsilon_values', 'minimum_points'])

        maxValueIndex = np.nanmax(
            all_dbscan_results_df.silhouette_score.astype("float").idxmax())

        best_parameters = all_dbscan_results_df.iloc[maxValueIndex]

        return best_parameters.epsilon_values, best_parameters.minimum_points

    def start_dbscan(self, data, eps: float = 0.5, min_samples: int = 5):

        # creating DBSCAN object for clustering the encodings with the metric "euclidean"
        dbscan_model = DBSCAN(
            eps=eps, min_samples=min_samples, n_jobs=2, metric="euclidean")

        # train the model
        dbscan_model.fit(data)

        labels = dbscan_model.labels_

        # determine the total number of unique faces found in the dataset
        # clt.labels_ contains the label ID for all faces in our dataset (i.e., which cluster each face belongs to).
        # To find the unique faces/unique label IDs, used NumPy’s unique function.
        # The result is a list of unique labelIDs
        label_ids = np.unique(dbscan_model.labels_)

        # we count the numUniqueFaces . There could potentially be a value of -1 in labelIDs — this value corresponds
        # to the “outlier” class where a 128-d embedding was too far away from any other clusters to be added to it.
        # “outliers” could either be worth examining or simply discarding based on the application of face clustering.
        num_unique_faces = len(np.where(label_ids > -1)[0])
        # print('Estimated number of unique faces: %d' % num_unique_faces)

        n_noise_ = list(dbscan_model.labels_).count(-1)
        # print('Estimated number of noise points: %d' % n_noise_)

        if num_unique_faces > 1:
            sil_score = silhouette_score(data, labels)
            # print("Silhouette Coefficient: %0.3f" % sil_score)
            return labels, sil_score

        return labels, None

    def cluster_faces_with_db_scan(self, pca_df_all_data, pca_df, best_pca_dimensions):

        eps_start_index: int = 1
        eps_end_index: int = 10
        eps_step: float = 0.5
        min_pts_start_index: int = 2
        min_pts_end_index: int = 10

        print("\n------------------------- get_optimal_parameters ------------------------------\n")

        best_eps, best_min_samples = self.get_optimal_parameters(pca_df, eps_start_index, eps_end_index, eps_step, min_pts_start_index, min_pts_end_index)

        print("best_min_samples", best_min_samples, "best_eps", best_eps)

        print("\n------------------------- start DBSCAN ------------------------------\n")

        labels, sil_score = self.start_dbscan(pca_df, eps=best_eps, min_samples=best_min_samples)

        label_ids = np.unique(labels)
        num_unique_faces = len(np.where(label_ids > -1)[0])
        print('Estimated number of unique faces: %d' % num_unique_faces)
        n_noise_ = list(labels).count(-1)
        print('Estimated number of noise points: %d' % n_noise_)
        print("DBSCAN silhouette_score :", sil_score)

        pca_df_all_data['cluster'] = labels

        print("\n------------------------- finish DBSCAN ------------------------------\n")

        return pca_df_all_data, pca_df, sil_score

    def start(self, faces):

        self.faces.extend(faces)
        print(len(self.faces))

        faces: pd.DataFrame = pd.DataFrame(self.faces)
        face_encodings: list = faces['face_encoding'].tolist()

        best_pca_dimensions: int = self.get_best_pca_dimensions(face_encodings)
        pca_df_all_data, pca_df = self.create_pca(faces, face_encodings, best_pca_dimensions)
        
        pca_df_all_data, pca_df, dbscan_sil_score = self.cluster_faces_with_db_scan(pca_df_all_data, pca_df, best_pca_dimensions)
        return pca_df_all_data, pca_df, dbscan_sil_score, face_encodings
