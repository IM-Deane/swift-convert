import React from "react";

function Icon({ imageSource, title, ...props }) {
	console.log(imageSource);
	return <img src={imageSource} alt={title} {...props} />;
}
export default Icon;
