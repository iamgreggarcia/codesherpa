import json
import tempfile
import os

import pytest

from utils.plugin import load_manifest, description_for_model

def test_load_manifest():
    """
    Test the load_manifest function.

    This function tests the positive case of the load_manifest function by checking if the returned object is a dictionary,
    if the key 'description_for_model' is present in the dictionary and if its value is equal to the description_for_model function.
    """
    manifest = load_manifest()
    assert isinstance(manifest, dict)
    assert "description_for_model" in manifest
    assert manifest["description_for_model"] == description_for_model