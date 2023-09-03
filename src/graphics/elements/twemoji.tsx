import React, { useEffect, useState } from "react";
import twemoji from "twemoji";

interface Props {
	noWrapper?: boolean;
	options?: Partial<twemoji.ParseObject>;
	tag?: string;
	children?: React.ReactNode;
}

const Twemoji = React.forwardRef((props: Props, ref) => {
	const [childrenRefs, setChildrenRefs] = useState<any[]>([]);
	useEffect(() => {
		if (props.noWrapper) {
			for (const i in childrenRefs) {
				const node = childrenRefs[i].current;
				twemoji.parse(node, props.options);
			}
		} else {
			const node = ref;
			twemoji.parse(node as any, props.options);
		}
	}, [childrenRefs, props.noWrapper, props.options, ref]);

	if (props.noWrapper) {
		const newChildrenRefs = [...childrenRefs];
		return (
			<>
				{React.Children.map(props.children, (c, i) => {
					if (typeof c === "string") {
						console.warn(`Twemoji can't parse string child when noWrapper is set. Skipping child "${c}"`);
						return c;
					}

					newChildrenRefs[i] = childrenRefs[i] || React.createRef();
					setChildrenRefs(newChildrenRefs);
					return React.cloneElement(c as React.ReactElement, { ref: childrenRefs[i] });
				})}
			</>
		);
	} else {
		return React.createElement(props.tag || "div", { ref }, props.children);
	}
});

Twemoji.displayName = "Twemoji";

export default Twemoji;

// export default class Twemoji extends React.Component {
//   static propTypes = {
//     children: PropTypes.node,
//     noWrapper: PropTypes.bool,
//     options: PropTypes.object,
//     tag: PropTypes.string
//   }

//   static defaultProps = {
//     tag: 'div'
//   }

//   constructor(props) {
//     super(props);
//     if (props.noWrapper) {
//       this.childrenRefs = {};
//     } else {
//       this.rootRef = React.createRef();
//     }
//   }

//   _parseTwemoji() {
//     const { noWrapper } = this.props;
//     if (noWrapper) {
//       for (const i in this.childrenRefs) {
//         const node = this.childrenRefs[i].current;
//         twemoji.parse(node, this.props.options);
//       }
//     } else {
//       const node = this.rootRef.current;
//       twemoji.parse(node, this.props.options);
//     }
//   }

//   componentDidMount() {
//     this._parseTwemoji();
//   }

//   render() {
//     const { children, noWrapper, tag,  ...other } = this.props;
//     if (noWrapper) {
//       return (
//         <>
//         {
//           React.Children.map(children, (c, i) => {
//             if (typeof c === 'string') {
//               // eslint-disable-next-line no-console
//               console.warn(`Twemoji can't parse string child when noWrapper is set. Skipping child "${c}"`);
//               return c;
//             }
//             this.childrenRefs[i] = this.childrenRefs[i] || React.createRef();
//             return React.cloneElement(c, { ref: this.childrenRefs[i] });
//           })
//         }
//         </>);
//     } else {
//       delete other.options;
//       return React.createElement(tag, { ref: this.rootRef, ...other }, children);
//     }
//   }
// }
