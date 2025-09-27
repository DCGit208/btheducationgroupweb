#!/bin/bash
# WORKSPACE ROLLBACK ENFORCEMENT DETECTOR
# Automatically detects and enforces rollback protocol in any workspace

echo "🔍 SCANNING WORKSPACE FOR ROLLBACK ENFORCEMENT..."
echo "=================================================="

WORKSPACE_ROOT=$(pwd)
GUARDRAIL_FILE="PROJECT_ROLLBACK_GUARDRAIL.md"
BACKUP_DIR="COMPLETE_BACKUP"
ROLLBACK_SCRIPT="COMPLETE_BACKUP/rollback-utility.sh"

echo "📂 Workspace: $WORKSPACE_ROOT"
echo ""

# Check for guardrail file
if [ -f "$GUARDRAIL_FILE" ]; then
    echo "🚨 ROLLBACK PROTOCOL DETECTED: ✅ ACTIVE"
    echo "   File: $GUARDRAIL_FILE"
    PROTOCOL_ACTIVE=true
else
    echo "ℹ️  Rollback Protocol: ❌ NOT ENFORCED"
    echo "   (No $GUARDRAIL_FILE found)"
    PROTOCOL_ACTIVE=false
fi

# Check for backup directory
if [ -d "$BACKUP_DIR" ]; then
    echo "💾 Backup System: ✅ OPERATIONAL"
    echo "   Directory: $BACKUP_DIR"
    BACKUP_READY=true
else
    echo "💾 Backup System: ❌ NOT AVAILABLE"
    BACKUP_READY=false
fi

# Check for rollback utility
if [ -x "$ROLLBACK_SCRIPT" ]; then
    echo "🛠️  Rollback Utility: ✅ EXECUTABLE"
    echo "   Script: $ROLLBACK_SCRIPT"
    UTILITY_READY=true
else
    echo "🛠️  Rollback Utility: ❌ NOT FOUND"
    UTILITY_READY=false
fi

echo ""
echo "📊 ENFORCEMENT SUMMARY:"
echo "======================"

if [ "$PROTOCOL_ACTIVE" = true ]; then
    echo "🚨 ROLLBACK PROTOCOL: **ENFORCED**"
    echo "   ⚠️  ALL CHANGES MUST FOLLOW BACKUP PROTOCOL"
    echo "   ⚠️  NO MODIFICATIONS WITHOUT TIMESTAMPED BACKUPS"
    
    if [ "$BACKUP_READY" = true ] && [ "$UTILITY_READY" = true ]; then
        echo "✅ ROLLBACK CAPABILITY: **FULLY OPERATIONAL**"
        echo "   🛡️  Safe to proceed with protocol compliance"
        echo ""
        echo "🔧 ROLLBACK COMMANDS AVAILABLE:"
        echo "   Verify: ./COMPLETE_BACKUP/rollback-utility.sh verify stepX"
        echo "   Rollback: ./COMPLETE_BACKUP/rollback-utility.sh rollback stepX 'reason'"
    else
        echo "❌ ROLLBACK CAPABILITY: **INCOMPLETE**"
        echo "   🚫 WORK MUST STOP - Backup system not ready"
        echo ""
        echo "🔧 REQUIRED ACTIONS:"
        [ "$BACKUP_READY" = false ] && echo "   - Create COMPLETE_BACKUP directory structure"
        [ "$UTILITY_READY" = false ] && echo "   - Install rollback-utility.sh script"
    fi
else
    echo "ℹ️  ROLLBACK PROTOCOL: **NOT ENFORCED**"
    echo "   ✅ Standard development workflow allowed"
fi

echo ""
echo "🎯 WORKSPACE STATUS: $([ "$PROTOCOL_ACTIVE" = true ] && echo "ROLLBACK ENFORCED" || echo "STANDARD MODE")"
echo "=================================================="