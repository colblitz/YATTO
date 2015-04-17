from calculate import *
from scipy.stats import chisquare
import numpy as np
import zerorpc
import logging
import json

logging.basicConfig()

def is_json(myjson):
  try:
	json_object = json.loads(myjson)
  except ValueError, e:
	return False
  return True

class HelloRPC(object):
	def test(self, info):
		print "artifacts: -------------------------"
		print info["artifacts"]
		print "weapons: ---------------------------"
		print info["weapons"]
		print "customizations: --------------------"
		print info["customizations"]
		print "stuff: -----------------------------"
		print info["relics"]
		print info["steps"]
		print info["greedy"]
		print info["method"]
		print "thing: ", thing
		print "thing class name: ", thing.__class__.__name__
		print "-------------------------------------"
		print str(thing)
		print "----------------------------------"
		info = json.loads(str(thing))
		print "info: ", info
		print "artifacts: ", info["artifacts"]
		return thing + " " + thing

	def get_best(self, info):
		artifacts = [0] * len(artifact_info)
		for a in info["artifacts"]:
			artifacts[a["index"]] = a["value"]
		
		weapons = [0] * len(hero_info)
		for w in info["weapons"]:
			weapons[w["index"]] = w["value"]
		
		customizations = [0] * 6
		for c in info["customizations"]:
			customizations[c["index"]] = c["value"]
		
		methods = []
		for m in info["methods"]:
			if m["value"]:
				methods.append(m["index"])

		relics = info["relics"]
		nsteps = info["nsteps"]
		greedy = info["greedy"] == 1

		response = {}
		for m in methods:
			print "getting steps for ", m
			steps = get_best(artifacts, weapons, customizations, relics, nsteps, m, greedy)
			summary = {}
			costs = {}
			for s in steps:
				i = int(s["index"])
				summary[i] = max(s["level"], summary.get(i))
				costs[i] = int(costs.get(i) or 0) + s["cost"]
			summary_steps = []
			for s in summary:
				step = {}
				step["index"] = s
				step["name"] = artifact_info[s].name
				step["level"] = summary[s]
				step["cost"] = costs[s]
				summary_steps.append(step)
			m_response = {}
			m_response["steps"] = steps
			m_response["summary"] = summary_steps
			response[m] = m_response
		print "done getting steps"
		return response

	def calculate_weapons_probability(self, weapons):
		return chisquare(weapons)[1]


s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()