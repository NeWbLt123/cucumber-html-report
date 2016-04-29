'use strict';

function sum(arr) {
  return arr.reduce(function(a, b) {
    return a + b;
  }, 0);
}

function validStep(step) {
  return step.hidden === undefined;
}

function stepPassed(step) {
  return 'passed' === step.result.status.toLocaleLowerCase();
}

function stepFailed(step) {
  return 'failed' === step.result.status.toLocaleLowerCase();
}

function getValidSteps(scenario) {
  return (scenario.steps || []).filter(validStep);
}

function getNumStepsForScenario(scenario) {
  return getValidSteps(scenario).length;
}

function getNumPassedStepsForScenario(scenario) {
  return getValidSteps(scenario).filter(stepPassed).length;
}

function getNumFailedStepsForScenario(scenario) {
  return getValidSteps(scenario).filter(stepFailed).length;
}

function isScenario(scenario) {
  return scenario.type === 'scenario';
}

function getScenarios(feature) {
  return (feature.elements || []).filter(isScenario);
}

function getFeatureResult(feature) {
  var scenarios = getScenarios(feature);
  var scenarioResults = scenarios.map(function(scenario) {
    return {
      numSteps: getNumStepsForScenario(scenario),
      passedSteps: getNumPassedStepsForScenario(scenario),
      failedSteps: getNumFailedStepsForScenario(scenario)
    };
  });

  var passedScenarios = sum(scenarioResults.map(function(res) {
    return res.numSteps === res.passedSteps ? 1 : 0;
  }));

  var failedScenarios = sum(scenarioResults.map(function(res) {
    return res.failedSteps > 0 ? 1 : 0;
  }));

  return {
    numScenarios: scenarios.length,
    passedScenarios: passedScenarios,
    failedScenarios: failedScenarios
  };
}


exports.calculateSummary = function(features) {
  var featureResults = features.map(getFeatureResult);

  var scenariosPassed = sum(featureResults.map(function(result) {
    return result.passedScenarios;
  }));

  var scenariosFailed = sum(featureResults.map(function(result) {
    return result.failedScenarios;
  }));

  return {
    totalFeatures: features.length,
    scenariosPassed: scenariosPassed,
    scenariosFailed: scenariosFailed,
    status: scenariosFailed === 0 ? 'OK' : 'NOK'
  };
};