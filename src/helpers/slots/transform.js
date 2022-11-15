import convertProperty from './property';


const convertTransform = (transform, props, properties) => {
	convertProperty(transform.o, props, properties);
	convertProperty(transform.r, props, properties);
	convertProperty(transform.p, props, properties);
	convertProperty(transform.s, props, properties);
	convertProperty(transform.a, props, properties);
	convertProperty(transform.so, props, properties);
	convertProperty(transform.eo, props, properties);
	convertProperty(transform.sk, props, properties);
	convertProperty(transform.sa, props, properties);
}

export default convertTransform