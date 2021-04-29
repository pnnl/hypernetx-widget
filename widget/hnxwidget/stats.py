import pandas as pd

import hypernetx as hnx
from hypernetx import algorithms as algo

def compute_stats(H):
    
    def compute_stats_helper(H, stats):
        return pd.DataFrame({
            k: func(H)
            for k, func in stats.items()
        })

    node_stats = {
        'Degree': lambda H: dict(zip(H, hnx.degree_dist(H)))
    }

    edges_stats = {
        'Centrality': algo.s_centrality_measures.s_betweenness_centrality
    }

    D = H.dual()
    
    node_data = pd.concat((compute_stats_helper(H, node_stats), compute_stats_helper(D, edges_stats)), axis=1)
    edge_data = pd.concat((compute_stats_helper(D, node_stats), compute_stats_helper(H, edges_stats)), axis=1)
    
    return {
        'node_data': node_data,
        'edge_data': edge_data
    }