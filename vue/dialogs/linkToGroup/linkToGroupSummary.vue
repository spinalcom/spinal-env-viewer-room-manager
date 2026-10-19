<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
	<md-dialog
		class="linkSummaryDialog"
		:md-active.sync="showDialog"
		@md-closed="closeDialog(false)"
	>
		<md-dialog-title>Link to group summary</md-dialog-title>

		<md-dialog-content>
			<div class="target">{{ categoryName }} / {{ groupName }}</div>

			<div v-if="loading" class="loading">
				<md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
			</div>

			<template v-else>
				<details
					v-for="section in sections"
					:key="section.key"
					class="section"
					:open="section.open"
				>
					<summary :class="section.key">
						{{ section.title }} : {{ section.items.length }}
					</summary>

					<ul>
						<li v-for="(item, index) in section.items" :key="index">
							{{ item.name }}
							<span v-if="item.from" class="detail">(from "{{ item.from }}")</span>
							<span v-if="item.error" class="detail">({{ item.error }})</span>
						</li>
					</ul>
				</details>
			</template>
		</md-dialog-content>

		<md-dialog-actions>
			<md-button class="md-primary" @click="closeDialog(false)">Close</md-button>
		</md-dialog-actions>
	</md-dialog>
</template>

<script>
	import { SpinalGraphService } from "spinal-env-viewer-graph-service";

	function getNodeName(id) {
		const info = SpinalGraphService.getInfo(id);
		return info && info.name ? info.name.get() : id;
	}

	export default {
		name: "linkToGroupSummaryDialog",
		props: ["onFinised"],
		data() {
			return {
				showDialog: true,
				loading: true,
				categoryName: "",
				groupName: "",
				added: [],
				moved: [],
				alreadyThere: [],
				failed: [],
			};
		},

		computed: {
			sections() {
				return [
					{ key: "added", title: "Newly added", items: this.added },
					{
						key: "moved",
						title: "Moved from another group of the category",
						items: this.moved,
					},
					{ key: "alreadyThere", title: "Already in the group", items: this.alreadyThere },
					{ key: "failed", title: "Failed", items: this.failed },
				]
					.filter((section) => section.items.length > 0)
					.map((section, index) =>
						Object.assign(section, {
							open: index === 0 || section.key === "failed",
						})
					);
			},
		},

		methods: {
			// linkResults: promise of [{ itemId, result: { old_group, newGroup } } | { itemId, error }]
			async opened({ items, linkResults, category, group }) {
				this.categoryName = category ? category.name : "";
				this.groupName = group ? group.name : "";

				const names = new Map(items.map((el) => [el.id, el.name]));
				const results = await linkResults;

				for (const { itemId, result, error } of results) {
					const name = names.get(itemId) || getNodeName(itemId);

					if (error) {
						console.error(error);
						this.failed.push({ name, error: error.message || String(error) });
					} else if (!result || !result.old_group) {
						this.added.push({ name });
					} else if (result.old_group === result.newGroup) {
						this.alreadyThere.push({ name });
					} else {
						this.moved.push({ name, from: getNodeName(result.old_group) });
					}
				}

				this.loading = false;
			},

			removed() {
				this.showDialog = false;
			},

			closeDialog(closeResult) {
				if (typeof this.onFinised === "function") {
					this.onFinised(closeResult);
				}
			},
		},
	};
</script>

<style scoped>
	.linkSummaryDialog {
		min-width: 400px;
		max-width: 600px;
	}

	.linkSummaryDialog .target {
		margin-bottom: 12px;
		font-weight: bold;
	}

	.linkSummaryDialog .loading {
		display: flex;
		justify-content: center;
	}

	.linkSummaryDialog .section {
		margin-bottom: 8px;
	}

	.linkSummaryDialog .section summary {
		cursor: pointer;
		font-weight: 500;
	}

	.linkSummaryDialog .section summary.added {
		color: #66bb6a;
	}

	.linkSummaryDialog .section summary.moved {
		color: #ffa726;
	}

	.linkSummaryDialog .section summary.failed {
		color: #ef5350;
	}

	.linkSummaryDialog .section ul {
		max-height: 200px;
		overflow-y: auto;
		margin: 4px 0;
	}

	.linkSummaryDialog .section .detail {
		opacity: 0.7;
	}
</style>
