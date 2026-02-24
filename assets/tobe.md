%%{init: { 'theme': 'base', 'gitGraph': {'mainBranchName': 'main'} } }%%
gitGraph
    commit id: "v0.1"
    branch develop
    checkout develop
    commit id: "Setup"

    branch feature-TKT-123
    checkout feature-TKT-123
    commit id: "feat_UI"
    commit id: "feat_Logic"
    commit id: "Peer_Review_OK" type: HIGHLIGHT
    
    checkout develop
    merge feature-TKT-123 id: "Merge_to_Dev"
    
    branch release-v1.0
    checkout release-v1.0
    commit id: "QA_Testing"
    commit id: "QA Fixes"
    commit id: "QA_PASSED" type: HIGHLIGHT

    checkout main
    merge release-v1.0 tag: "v1.0"
    
    checkout develop
    merge release-v1.0 id: "Sync_Release_Dev"

    checkout main
    branch hotfix-crash-prod
    checkout hotfix-crash-prod
    commit id: "fix_error_critico"
    
    checkout main
    merge hotfix-crash-prod tag: "v1.0.1"

    checkout develop
    merge hotfix-crash-prod id: "Sync_Hotfix_Dev"