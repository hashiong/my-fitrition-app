<div className="mt-8">
				<table className="w-full">
					<thead>
						<tr>
							<th className="px-4 py-2">Item Name</th>
							<th className="px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{menuItems.map((menuItem, index) => (
							<tr key={index}>
								<td className="border px-4 py-2">
									<input
										type="text"
										value={menuItem.itemName}
										onChange={(e) =>
											handleMenuItemChange(index, "itemName", e.target.value)
										}
										className="w-full"
									/>
									{items
										.filter(
											(item) =>
												searchQuery !== "" &&
												(item.EnDescription.toLowerCase().includes(
													searchQuery.toLowerCase()
												) ||
													item.ChnDescription.toLowerCase().includes(
														searchQuery.toLowerCase()
													) ||
													item.ItemID.toString().includes(searchQuery))
										)
										.map((item) => (
											<div
												key={item.id}
												className="p-4 mb-2 w-full bg-gray-100 rounded-lg shadow flex justify-between items-center"
											>
												<div className="">
													<p className="text-md font-semibold text-gray-500">
														Item ID: {item.ItemID} {"  "}
														<span className="font-bold text-lg text-black">
															{" "}
															{/* Adjusted for emphasis */}
															{item.ChnDescription} ({item.EnDescription})
														</span>{" "}
														<span className="text-gray-600">
															Category: {item.Category}
														</span>
													</p>
												</div>
                                                <button
								onClick={() => handleAdd(item)}
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded-lg"
							>
								Add
							</button>
											</div>
										))}
								</td>

								<td className="border px-4 py-2">
									<button
										className="bg-red-500 text-white px-2 py-1 rounded mr-2"
										onClick={() => handleRemoveMenuItem(index)}
									>
										Remove
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="mt-4">
					<button
						className="bg-green-500 text-white px-4 py-2 rounded mr-4"
						onClick={handleAddMenuItem}
					>
						Add New Item
					</button>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
						onClick={handleSaveChanges}
					>
						Save Changes
					</button>
					<button
						className="bg-gray-500 text-white px-4 py-2 rounded"
						onClick={handleClearAll}
					>
						Clear All
					</button>
				</div>
			</div>