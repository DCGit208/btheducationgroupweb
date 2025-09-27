#!/bin/bash
# SEAMLESS ROLLBACK UTILITY
# BTH Website Redesign Project

BACKUP_ROOT="/Users/achugustave/Desktop/BTH Website Redesign/btheducationgroupweb/COMPLETE_BACKUP"
PROJECT_ROOT="/Users/achugustave/Desktop/BTH Website Redesign/btheducationgroupweb"
GUARDRAIL_FILE="$PROJECT_ROOT/PROJECT_ROLLBACK_GUARDRAIL.md"

# Function: Automatic rollback to specific step
rollback_to_step() {
    local step_id="$1"
    local reason="$2"
    
    echo "🔄 INITIATING ROLLBACK TO: $step_id"
    echo "Reason: $reason"
    
    STEP_PATH="$BACKUP_ROOT/$step_id"
    
    if [ ! -d "$STEP_PATH" ]; then
        echo "❌ ROLLBACK FAILED: Step $step_id not found"
        return 1
    fi
    
    # Rollback HTML files
    if [ -d "$STEP_PATH/html" ]; then
        cp "$STEP_PATH/html"/*.html "$PROJECT_ROOT/"
        echo "✅ HTML files restored"
    fi
    
    # Rollback CSS files  
    if [ -d "$STEP_PATH/css" ]; then
        cp -r "$STEP_PATH/css"/* "$PROJECT_ROOT/assets/css/"
        echo "✅ CSS files restored"
    fi
    
    # Rollback JS files
    if [ -d "$STEP_PATH/js" ]; then
        cp -r "$STEP_PATH/js"/* "$PROJECT_ROOT/assets/js/" 2>/dev/null
        echo "✅ JS files restored"
    fi
    
    # Log the rollback
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "| $timestamp | ROLLBACK | $step_id | Reason: $reason | ✅ COMPLETED |" >> "$PROJECT_ROOT/ROLLBACK_LOG.txt"
    
    # Update guardrail document
    update_guardrail_rollback "$step_id" "$reason"
    
    echo "✅ ROLLBACK COMPLETED SUCCESSFULLY"
    echo "📍 Project restored to: $step_id"
    
    return 0
}

# Function: Update guardrail with rollback action
update_guardrail_rollback() {
    local step_id="$1"
    local reason="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # This would update the guardrail table - simplified for demo
    echo "Rollback logged: $timestamp - $step_id - $reason"
}

# Function: Verify rollback capability before making changes
verify_rollback_ready() {
    local step_id="$1"
    
    STEP_PATH="$BACKUP_ROOT/$step_id"
    
    if [ ! -d "$STEP_PATH" ]; then
        echo "❌ NO ROLLBACK AVAILABLE: Step $step_id not found"
        return 1
    fi
    
    echo "✅ ROLLBACK READY: Can restore to $step_id"
    return 0
}

# Main command interface
case "$1" in
    "rollback")
        rollback_to_step "$2" "$3"
        ;;
    "verify")
        verify_rollback_ready "$2"
        ;;
    *)
        echo "Usage: $0 {rollback|verify} step_id [reason]"
        echo "Example: $0 rollback step0-20250923-171649 'CSS conflicts'"
        echo "Example: $0 verify step0-20250923-171649"
        ;;
esac