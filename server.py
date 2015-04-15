from calculate import *
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
	def test(self, thing):
		print "thing: ", thing
		print "thing class name: ", thing.__class__.__name__
		info = json.loads(thing)
		print "info: ", info
		print "artifacts: ", info["artifacts"]
		return thing + " " + thing

	def get_best(self, artifacts, weapons, customizations, relics, nsteps, method, greedy = True):
		print "getting best"
		r = get_best(artifacts, weapons, customizations, 121840, None, SPS, True)
		# should transform r into json or something

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()