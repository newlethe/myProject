package com.sgepit.pcmis.zlgk.hbm;

public class PcZlgkZlypSortRightBean {
	
		private String unitId;
		private String unitName;
		private String parentUnitId;
		private boolean isLeaf;
		private String unitTypeId;
		private String sortId;
		private String read;
		private String write;	
		
		public PcZlgkZlypSortRightBean() {
			super();
			// TODO Auto-generated constructor stub
		}
		public PcZlgkZlypSortRightBean(String unitId,String unitName, String parentUnitId,String unitTypeId,boolean isLeaf,
				String sortId, String read, String write) {
			super();
			this.unitId = unitId;
			this.unitName = unitName;
			this.parentUnitId = parentUnitId;
			this.isLeaf = isLeaf;
			this.unitTypeId = unitTypeId;
			this.sortId = sortId;
			this.read = read;
			this.write = write;
		}
		public String getUnitId() {
			return unitId;
		}
		public void setUnitId(String unitId) {
			this.unitId = unitId;
		}
		
		public String getUnitName() {
			return unitName;
		}
		public void setUnitName(String unitName) {
			this.unitName = unitName;
		}
		public String getParentUnitId() {
			return parentUnitId;
		}
		public void setParentUnitId(String parentUnitId) {
			this.parentUnitId = parentUnitId;
		}
		
		public String getUnitTypeId() {
			return unitTypeId;
		}
		public void setUnitTypeId(String unitTypeId) {
			this.unitTypeId = unitTypeId;
		}
		
		
		public boolean isLeaf() {
			return isLeaf;
		}
		public void setLeaf(boolean isLeaf) {
			this.isLeaf = isLeaf;
		}
		public String getSortId() {
			return sortId;
		}
		public void setSortId(String sortId) {
			this.sortId = sortId;
		}
		public String getRead() {
			return read;
		}
		public void setRead(String read) {
			this.read = read;
		}
		public String getWrite() {
			return write;
		}
		public void setWrite(String write) {
			this.write = write;
		}
}
