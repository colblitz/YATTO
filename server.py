from calculate import *
import zerorpc
import logging
logging.basicConfig()

class HelloRPC(object):
	def test(self, thing):
		print "thing: ", thing
		return thing + " " + thing

	def get_best(self, artifacts, weapons, customizations, relics, nsteps, method, greedy = True):
		print "getting best"
		r = get_best(artifacts, weapons, customizations, 121840, None, SPS, True)
		# should transform r into json or something

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()