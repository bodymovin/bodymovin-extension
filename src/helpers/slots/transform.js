import convertProperty from './property';


const convertTransform = (transform, slots, properties) => {
	convertProperty(transform.o, slots, properties);
	convertProperty(transform.r, slots, properties);
	convertProperty(transform.p, slots, properties);
	convertProperty(transform.s, slots, properties);
	convertProperty(transform.a, slots, properties);
	convertProperty(transform.so, slots, properties);
	convertProperty(transform.eo, slots, properties);
	convertProperty(transform.sk, slots, properties);
	convertProperty(transform.sa, slots, properties);
}

export default convertTransform