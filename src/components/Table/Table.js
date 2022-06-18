import { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { get } from "lodash-es";
import { clickOnEnter, eventOnElement } from "../../global/Functions.js";
import "./Table.css";

/*****************************************************
 * Constants
 *****************************************************/

const internalStates = {
	UPDATE_MAX_PAGE: "UPDATE_MAX_PAGE",
	SET_ITEMS_PER_PAGE: "SET_ITEMS_PER_PAGE",
	SET_PAGE: "SET_PAGE"
};

const initialState = { dataLength: 0, perPage: 20, currPage: 0, maxPage: 0 };

const getMaxPage = (dataLength, itemsPerPage) => {
	if (dataLength === 0 || itemsPerPage === 0) {
		return 0;
	}

	return Math.ceil(dataLength / itemsPerPage) - 1;
};

function Table({ data, keyProp, header, body, perPage }) {
	/* ---- States ---------------------------------- */
	const [pagination, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case internalStates.UPDATE_MAX_PAGE:
				return { ...state, dataLength: data.length, maxPage: getMaxPage(data.length, state.perPage) };
			case internalStates.SET_ITEMS_PER_PAGE:
				return { ...state, perPage: action.perPage, maxPage: getMaxPage(state.dataLength, action.perPage) };
			case internalStates.SET_PAGE:
				return { ...state, currPage: action.pageIndex };
			default:
				throw new Error("Table: Invalid action.type!");
		}
	}, { ...initialState, perPage: perPage ?? initialState.perPage }, undefined);
	
	/* ---- Functions ------------------------------- */
	const toFirstPage = () => dispatch({ type: internalStates.SET_PAGE, pageIndex: 0 });
	const toLastPage = () => dispatch({ type: internalStates.SET_PAGE, pageIndex: pagination.maxPage });
	
	const toPrevPage = () => {
		const pageIndex = pagination.currPage -1;
		
		if (pageIndex >= 0) {
			dispatch({ type: internalStates.SET_PAGE, pageIndex });
		}
	};
	const toNextPage = () => {
		const pageIndex = pagination.currPage + 1;
		
		if (pageIndex <= pagination.maxPage) {
			dispatch({ type: internalStates.SET_PAGE, pageIndex });
		}
	};
	
	const toPageIndex = index => {
		if ((0 <= index) && (index <= pagination.maxPage)) {
			dispatch({ type: internalStates.SET_PAGE, pageIndex: index });
		}
	};
	
	const updateMaxPage = () => dispatch({ type: internalStates.UPDATE_MAX_PAGE });
	
	const getSlice = () => data.slice((pagination.perPage * pagination.currPage), ((pagination.perPage * pagination.currPage) + pagination.perPage));
	
	const drawPosition = () => {
		return <span className="table-position">Affichage de {getSlice().length} sur {pagination.dataLength} &eacute;l&eacute;ments.</span>;
	};
	
	const drawPagination = (position = "top") => {
		const indexes = {
			previousAgain: pagination.currPage - 2,
			previous: pagination.currPage - 1,
			next: pagination.currPage + 1,
			nextAgain: pagination.currPage + 2
		};
		const has = {
			previousAgain: indexes.previousAgain >= 0,
			previous: indexes.previous >= 0,
			next: indexes.next <= pagination.maxPage,
			nextAgain: indexes.nextAgain <= pagination.maxPage,
		};
		
		return (
			<div className={`table-pagination ${position}`}>
				<span className="pagination-item to-first" onClick={toFirstPage} onKeyDown={e => clickOnEnter(e, toFirstPage)} role="button" tabIndex={0}>&lt;&lt;</span>
				<span className="pagination-item to-prev" onClick={toPrevPage} onKeyDown={e => clickOnEnter(e, toPrevPage)} role="button" tabIndex={0}>&lt;</span>
				
				{(!has.next && has.previousAgain) && <span className="pagination-item prev-again-page" {...eventOnElement(toPageIndex, indexes.previousAgain)}>{indexes.previousAgain + 1}</span>}
				{has.previous && <span className="pagination-item prev-page" {...eventOnElement(toPageIndex, indexes.previous)}>{indexes.previous + 1}</span>}
				<span className="pagination-item curr-page">{pagination.currPage + 1}</span>
				{has.next && <span className="pagination-item next-page" {...eventOnElement(toPageIndex, indexes.next)}>{indexes.next + 1}</span>}
				{(!has.previous && has.nextAgain) && <span className="pagination-item next-again-page" {...eventOnElement(toPageIndex, indexes.nextAgain)}>{indexes.nextAgain + 1}</span>}
				
				<span className="pagination-item to-next" onClick={toNextPage} onKeyDown={e => clickOnEnter(e, toNextPage)} role="button" tabIndex={0}>&gt;</span>
				<span className="pagination-item to-last" onClick={toLastPage} onKeyDown={e => clickOnEnter(e, toLastPage)} role="button" tabIndex={0}>&gt;&gt;</span>
			</div>
		);
	};
	
	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (pagination.dataLength !== data.length) {
			updateMaxPage();
		}
	}, [pagination.dataLength, data]);
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="table">
			<div className="table-widgets">
				{drawPosition()}
				{drawPagination("top")}
			</div>
			
			<div className="table-wrapper">
				<table>
					<thead>
						<tr>
							{header}
						</tr>
					</thead>
					
					<tbody>
						{getSlice().map(item => (
							<tr key={`table-item-${get(item, keyProp, "")}`}>
								{body(item)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			<div className="table-widgets">
				{drawPosition()}
				{drawPagination("bottom")}
			</div>
		</div>
	);
}
Table.propTypes = {
	data: PropTypes.array.isRequired,
	keyProp: PropTypes.string.isRequired,
	header: PropTypes.node.isRequired,
	body: PropTypes.func.isRequired,
	perPage: PropTypes.number,
};

export default Table;
