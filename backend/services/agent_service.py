from agent.orchestrator import run_agent

def run_agent_service(repo_url: str):
    print(f"[SERVICE] Starting agent for repo: {repo_url}")
    result = run_agent(repo_url)
    return result
