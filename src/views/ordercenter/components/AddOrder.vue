<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      label-position="left"
      label-width="120px"
      class="form-container el-form"
    >
      <div class="createPost-main-container">
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              基础信息
            </div>
            <div class="tools">
              <a href="javascript:void(0);" @click="baseinfoShow = !baseinfoShow">
                <i
                  :class="{'is-active':baseinfoShow}"
                  class="el-collapse-item__arrow el-icon-arrow-up"
                />
              </a>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="baseinfoShow" class="portlet-body form">
              <!-- BEGIN FORM-->
              <div class="form-body">
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="订单单号">
                      <el-input v-model="postForm.invoiceBaseDto.vbillno" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="订单状态">
                      <el-select v-model="vbillstatus" placeholder="请选择订单状态" disabled>
                        <el-option label="新建" value="0"/>
                        <el-option v-if="isEdit" label="已确认" value="1"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="回单数" >
                      <el-input v-model="num" :disabled="true" placeholder="回单数"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="提货方" prop="invoiceBaseDto.pk_carrier">
                      <el-select v-model="postForm.invoiceBaseDto.pk_carrier" placeholder="选择承运商" filterable clearable class="required">
                        <el-option
                          v-for="item in carrierList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="委托客户" prop="invoiceBaseDto.pk_customer">
                      <el-select :disabled="sysCode==='100004'" v-model="postForm.invoiceBaseDto.pk_customer" placeholder="委托客户" filterable clearable class="required" @change="changeBala">
                        <el-option
                          v-for="item in entCustomerList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="结算客户" prop="invoiceBaseDto.bala_customer">
                      <el-select v-model="postForm.invoiceBaseDto.bala_customer" placeholder="结算客户" filterable clearable class="required">
                        <el-option
                          v-for="item in entCustomerList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="客户编号">
                      <el-input v-model="postForm.invoiceBaseDto.custOrderno" placeholder="客户编号"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="运输方式" prop="invoiceBaseDto.pk_trans_type">
                      <el-select v-model="postForm.invoiceBaseDto.pk_trans_type" placeholder="运输方式" class="required" @change="changeCarLength">
                        <el-option v-for="item in pk_trans_typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="车长" prop="invoiceBaseDto.car_length">
                      <!-- <el-input v-model="postForm.invoiceBaseDto.car_length" placeholder="车长"/> -->
                      <el-select
                        v-model="postForm.invoiceBaseDto.car_length"
                        :class="{'required':postForm.invoiceBaseDto.pk_trans_type==='5fda0edc8df34b4d8c1ed44a6f1f866e'}"
                        :disabled ="postForm.invoiceBaseDto.pk_trans_type!=='5fda0edc8df34b4d8c1ed44a6f1f866e'"
                        placeholder="选择车长"
                        multiple>
                        <el-option
                          v-for="item in car_lengthOptions"
                          :key="item.key"
                          :label="item.display_name"
                          :value="item.key"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="提货日期" prop="invoiceBaseDto.req_deli_date">
                      <el-date-picker
                        v-model="postForm.invoiceBaseDto.req_deli_date"
                        type="datetime"
                        placeholder="提货日期"
                        class="required"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="08:00:00"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="到货日期" prop="invoiceBaseDto.req_arri_date">
                      <el-date-picker
                        v-model="postForm.invoiceBaseDto.req_arri_date"
                        type="datetime"
                        placeholder="到货日期"
                        class="required"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="08:00:00"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="车型" >
                      <el-select v-model="postForm.invoiceBaseDto.car_model" placeholder="车型" >
                        <el-option label="平板车" value="平板车"/>
                        <el-option label="栏车" value="栏车"/>
                        <el-option label="厢式车" value="厢式车"/>
                        <el-option label="冷藏车" value="冷藏车"/>
                        <el-option label="特种车" value="特种车"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="总重量(t)">
                      <el-input
                        v-model="postForm.invoiceBaseDto.weight_count"
                        placeholder="总重量"
                        class="readColor"
                        readonly
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="总件数">
                      <el-input
                        v-model="postForm.invoiceBaseDto.num_count"
                        placeholder="总件数"
                        class="readColor"
                        readonly
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="总体积(m³)">
                      <el-input
                        v-model="postForm.invoiceBaseDto.volume_count"
                        placeholder="总体积"
                        class="readColor"
                        readonly
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="合同总额">
                      <el-input-number v-model="postForm.invoiceBaseDto.contract_amount" :precision="2" :step="1" :min="0" placeholder="合同总额"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="货物总价值">
                      <el-input-number v-model="postForm.invoiceBaseDto.amount" :precision="2" :step="1" :min="0" placeholder="货物总价值"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="保险总金额">
                      <el-input-number v-model="postForm.invoiceBaseDto.insurance_amount" :precision="2" :step="1" :min="0" placeholder="保险总金额" @change="insurance" />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :xs="24" :sm="24" :lg="3">
                    <el-form-item label="是否保险">
                      <el-switch v-model="postForm.invoiceBaseDto.if_insurance" active-value="Y" inactive-value="N"/>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="结算方式" >
                      <el-radio-group v-model="postForm.invoiceBaseDto.balatype" disabled>
                        <el-radio label="0">月结</el-radio>
                        <el-radio label="1">现结</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="支付方式" prop="invoiceBaseDto.pay_type">
                      <el-select v-model="postForm.invoiceBaseDto.pay_type" placeholder="支付方式" clearable class="filter-item required" >
                        <el-option v-for="item in payOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="增值服务">
                      <el-select v-model="postForm.invoiceBaseDto.handlingCode" placeholder="增值服务" clearable >
                        <el-option v-for="item in handlingCodeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8" >
                    <el-form-item label="是否加急" class="redItem" >
                      <!-- <el-switch v-model="postForm.invoiceBaseDto.if_urgent" active-value="Y" inactive-value="N"/> -->
                      <el-radio-group v-model="postForm.invoiceBaseDto.if_urgent">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="checkPermission(['tms.order.create.upload'])" :xs="24" :sm="24" :lg="8" >
                    <el-form-item label="选择图片">
                      <!-- <el-upload
                          :limit="3"
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          multiple
                        > -->
                      <el-badge :value="attachNum">
                        <el-button size="small" type="primary" @click="dialogAttachmentVisible = true">上传附件</el-button>
                      </el-badge>
                      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                      <!-- </el-upload> -->
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="创建人" >
                      <el-input v-model="create_user" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="16">
                    <el-form-item label="特殊运输要求">
                      <el-input
                        v-model="postForm.invoiceBaseDto.special_req"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        type="textarea"
                        placeholder="备注"
                      />
                    </el-form-item>
                  </el-col>
                  <!-- <el-row :gutter="24"> -->

                  <!-- </el-row> -->
                </el-row>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              发货信息
            </div>
            <div class="tools">
              <a href="javascript:void(0);" @click="baseinfoShowTwo = !baseinfoShowTwo">
                <i
                  :class="{'is-active':baseinfoShowTwo}"
                  class="el-collapse-item__arrow el-icon-arrow-up"
                />
              </a>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="baseinfoShowTwo" class="portlet-body form">
              <div class="form-body">
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="发货方" prop="deliInfoDto.pk_delivery">
                      <el-select
                        v-model="postForm.deliInfoDto.pk_delivery"
                        filterable
                        placeholder="发货方"
                        class="required"
                        @change="deliveryName()"
                      >
                        <el-option
                          v-for="(item,index) in addressName"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="6">
                    <el-form-item label="提货地址" prop="deliInfoDto.deli_province">
                      <el-input v-model="postForm.deliInfoDto.deli_province" placeholder="省" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="4">
                    <el-form-item prop="deliInfoDto.deli_city" label-width="0">
                      <el-input v-model="postForm.deliInfoDto.deli_city" placeholder="市" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="4">
                    <el-form-item prop="deliInfoDto.deli_area" label-width="0">
                      <el-input v-model="postForm.deliInfoDto.deli_area" placeholder="区" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="10">
                    <el-form-item prop="deliInfoDto.deli_detail_addr" label-width="0">
                      <el-input
                        v-model="postForm.deliInfoDto.deli_detail_addr"
                        placeholder="详细地址"
                        class="required"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="联系人" prop="deliInfoDto.deli_contact">
                      <el-input v-model="postForm.deliInfoDto.deli_contact" placeholder="联系人" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="联系手机" prop="deliInfoDto.deli_mobile">
                      <el-input v-model="postForm.deliInfoDto.deli_mobile" placeholder="联系手机" class="required" maxlength="13"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="联系座机" prop="deliInfoDto.deli_phone">
                      <el-input v-model="postForm.deliInfoDto.deli_phone" placeholder="联系座机(带区号) 格式:0XX(X)-XXX(X)-XXXX" maxlength="14"/>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="24">
                    <el-form-item label="备注">
                      <el-input
                        v-model="postForm.deliInfoDto.deli_memo"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        type="textarea"
                        placeholder="备注"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              收货信息
            </div>
            <div class="tools">
              <a href="javascript:void(0);" @click="baseinfoShowThree = !baseinfoShowThree">
                <i
                  :class="{'is-active':baseinfoShowThree}"
                  class="el-collapse-item__arrow el-icon-arrow-up"
                />
              </a>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="baseinfoShowThree" class="portlet-body form">
              <div class="form-body">
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="收货方" prop="arriInfoDto.pk_arrival">
                      <el-select
                        v-model="postForm.arriInfoDto.pk_arrival"
                        filterable
                        placeholder="收货方"
                        class="required"
                        @change="arrivalName()"
                      >
                        <el-option
                          v-for="(item,index) in addressName"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="6">
                    <el-form-item label="收货地址" prop="arriInfoDto.arri_province">
                      <el-input v-model="postForm.arriInfoDto.arri_province" placeholder="省" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="4" >
                    <el-form-item prop="arriInfoDto.arri_city" label-width="0">
                      <el-input v-model="postForm.arriInfoDto.arri_city" placeholder="市" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="4">
                    <el-form-item prop="arriInfoDto.arri_area" label-width="0">
                      <el-input v-model="postForm.arriInfoDto.arri_area" placeholder="区" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="10">
                    <el-form-item prop="arriInfoDto.arri_detail_addr" label-width="0">
                      <el-input
                        v-model="postForm.arriInfoDto.arri_detail_addr"
                        placeholder="详细地址"
                        class="required"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="收货联系人" prop="arriInfoDto.arri_contact">
                      <el-input v-model="postForm.arriInfoDto.arri_contact" placeholder="收货联系人" class="required"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="联系手机" prop="arriInfoDto.arri_mobile">
                      <el-input v-model="postForm.arriInfoDto.arri_mobile" placeholder="联系手机" class="required" maxlength="13"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :lg="8">
                    <el-form-item label="联系座机" prop="arriInfoDto.arri_phone" >
                      <el-input v-model="postForm.arriInfoDto.arri_phone" placeholder="联系座机(带区号) 格式:0XX(X)-XXX(X)-XXXX" maxlength="14"/>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row :gutter="24">
                  <el-col :xs="24" :sm="24" :lg="24">
                    <el-form-item label="备注">
                      <el-input
                        v-model="postForm.arriInfoDto.arri_memo"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        type="textarea"
                        placeholder="备注"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div :class="{'tableMargin':!isEdit}" class="portlet light">
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              货物信息
            </div>
            <div class="tools">
              <a href="javascript:void(0);" @click="baseinfoShowFour = !baseinfoShowFour">
                <i
                  :class="{'is-active':baseinfoShowFour}"
                  class="el-collapse-item__arrow el-icon-arrow-up"
                />
              </a>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="baseinfoShowFour" class="portlet-body form">
              <el-button class="change-btn btnGreen" size="mini" @click="addGoodspack(goodList)">新增</el-button>
              <div class="form-body"/>
              <el-table :data="goodList.data" border style="width: 100%" highlight-current-row>
                <el-table-column
                  v-for="(v,i) in goodList.columns"
                  :key="i"
                  :prop="v.field"
                  :label="v.title"
                  :min-width="v.width"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isSet">
                      <el-select v-if="i===1" v-model="goodList.sel[v.field]" placeholder="请选择">
                        <el-option
                          v-for="item in goodsNames"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"/>
                      </el-select>
                      <el-input v-else-if="i===0" id="goodstable" v-model="goodList.sel[v.field]" placeholder="请输入内容"/>
                      <el-input-number v-else-if="i===2" v-model="goodList.sel[v.field]" :precision="0" :step="1" :min="1" class="required"/>
                      <el-input-number v-else-if="i===3" v-model="goodList.sel[v.field]" :precision="3" :step="1" :min="0" class="required" placeholder="请输入内容"/>
                      <el-select v-else-if="i===5" v-model="goodList.sel[v.field]" placeholder="请选择">
                        <el-option
                          v-for="item in goodsPack"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"/>
                      </el-select>
                      <el-input-number v-else v-model="goodList.sel[v.field]" :precision="3" :step="1" :min="0"/>
                    </span>
                    <span v-else>
                      <span v-if="i===3||i===4">{{ changeItem(scope.row[v.field]) }}</span>
                      <span v-else>{{ scope.row[v.field] }}</span>
                      <!-- {{ changeItem(scope.row[v.field][3]) }} -->
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <span
                      class="el-tag el-tag--mini"
                      style="cursor: pointer;"
                      @click="editInfo(scope.row,scope.$index,true,goodList,'goods')"
                    >{{ scope.row.isSet?"保存":"编辑" }}</span>
                    <span
                      v-if="!scope.row.isSet"
                      class="el-tag el-tag--danger el-tag--mini"
                      style="cursor: pointer;"
                      @click="deleteInfo(scope.$index, goodList.data)"
                    >删除</span>
                    <span
                      v-else
                      class="el-tag el-tag--danger el-tag--mini"
                      style="cursor: pointer;"
                      @click="editInfo(scope.row,scope.$index,false,goodList,'goods')"
                    >取消</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </div>
        <div v-if="isEdit" class="portlet light tableMargin" >
          <div class="portlet-title">
            <div class="caption">
              <i class="icon-equalizer"/>
              费用信息
            </div>
            <div class="tools">
              <a href="javascript:void(0);" @click="baseinfoShowFive = !baseinfoShowFive">
                <i
                  :class="{'is-active':baseinfoShowFive}"
                  class="el-collapse-item__arrow el-icon-arrow-up"
                />
              </a>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="baseinfoShowFive" class="portlet-body form">
              <div class="form-body"/>
              <el-row :gutter="24" style="margin-top: 10px;">
                <el-col :xs="24" :sm="24" :lg="2" style="line-height:30px">
                  <span>收费明细</span>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="3">
                  <el-button class="btnGreen change-btn" size="mini" @click="addInfo(revenueList)">新增</el-button>
                </el-col>
              </el-row>
              <div class="form-body"/>
              <el-table :data="revenueList.data" :summary-method="getSummaries" border style="width: 100%" highlight-current-row show-summary>
                <el-table-column
                  v-for="(v,i) in revenueList.columns"
                  :key="i"
                  :prop="v.field"
                  :label="v.title"
                  :min-width="v.width"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.isSet">
                      <el-input-number v-if="i===3" v-model="revenueList.sel[v.field]" :min="0" :max="99999999" :step="0.01" :precision="2"/>
                      <span v-else-if="i===0||i===2">{{ scope.row[v.field] }}</span>
                      <!-- <el-checkbox v-else-if="i===1" v-model="revenueList.sel[v.field]" true-label="Y" false-label="N"/> -->
                      <!-- <el-input v-if="i===1" v-model="revenueList.sel[v.field]" placeholder="请输入内容" type="number" step="0.01" max="999999999"/> -->
                      <el-input v-else-if="i===1" id="revenuetable" v-model="revenueList.sel[v.field]" placeholder="请输入内容" maxlength="10"/>
                      <el-input v-else v-model="revenueList.sel[v.field]" placeholder="请输入内容" maxlength="100"/>
                    </span>
                    <span v-else-if="i===3">{{ scope.row[v.field].toFixed(2) }}</span>
                    <span v-else>{{ scope.row[v.field] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <span
                      class="el-tag el-tag--mini"
                      style="cursor: pointer;"
                      @click="editInfo(scope.row,scope.$index,true,revenueList,'revenueList')"
                    >{{ scope.row.isSet?"保存":"编辑" }}</span>
                    <span
                      v-if="!scope.row.isSet"
                      class="el-tag el-tag--danger el-tag--mini"
                      style="cursor: pointer;"
                      @click="deleteInfo(scope.$index, revenueList.data,scope.row.pk_fee)"
                    >删除</span>
                    <span
                      v-else
                      class="el-tag el-tag--danger el-tag--mini"
                      style="cursor: pointer;"
                      @click="editInfo(scope.row,scope.$index,false,revenueList,'revenueList')"
                    >取消</span>
                  </template>
                </el-table-column>
              </el-table>
              <!-- END FORM-->
            </div>
          </el-collapse-transition>
        </div>
        <div class="page-operation-bottons">
          <!-- <div style="margin: 10px 20px;float:left">总金额：{{ totalSum }}</div> -->
          <el-button
            v-loading="loading"
            v-if="(checkPermission(['tms.order.create.save'])||checkPermission(['tms.order.edit.save']))&&postForm.invoiceBaseDto.vbillstatus !== '已确认'"
            style="margin: 10px 20px;float:right"
            type="primary"
            icon="el-icon-check"
            @click="submitForm"
          >保存</el-button>
          <el-button
            v-loading="loading"
            v-if="checkPermission(['tms.order.edit.confirm'])&&isEdit&&postForm.invoiceBaseDto.vbillstatus !== '已确认'"
            style="margin: 10px 20px;float:right"
            class="confrim-btn"
            icon="el-icon-success"
            @click="confirmInvoice"
          >确认</el-button>
          <el-button
            v-loading="loading"
            v-if="checkPermission(['tms.order.edit.copy'])&&isEdit"
            style="margin: 10px 20px;float:right"
            type="primary"
            icon="el-icon-plus"
            @click="copyAdd"
          >复制新增</el-button>
        </div>
      </div>
    </el-form>
    <upload-attachment :show.sync="dialogAttachmentVisible" :onselect="selectUpload" :opinion.sync="attamentDto" />
  </div>
</template>
<script>
import EnumType from '@/constants/enumType'
import UploadAttachment from '@/components/UploadAttachment'
import { getCarrier, createOrder, getAddress, getGoodsName, editInterface, confirmOrder, getEntCustomer, addOrUpdateFee, deleteFee } from '@/api/order'
import { costInfo } from '@/api/settlement'
import checkPermission from '@/utils/permission' // 权限判断函数
import { sortList } from '@/utils/sort'
import { Debounce } from '@/utils/debounce'
import { getSysCode } from '@/utils/auth'
// import { fixedList } from '@/utils/fixedNum'
export default {
  // name: 'AddOrder',
  components: { UploadAttachment },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var car_length = (rule, value, callback) => {
      // debugger
      if (this.postForm.invoiceBaseDto.pk_trans_type === '5fda0edc8df34b4d8c1ed44a6f1f866e' && value.length <= 0) {
        callback(new Error('请选择车长'))
      } else {
        callback()
      }
    }
    var req_deli_date = (rule, value, callback) => {
      if (new Date(value).getTime() < new Date().getTime()) {
        return this.$message.warning('提货时间不能小于当前时间')
      } else {
        callback()
      }
    }
    var req_arri_date = (rule, value, callback) => {
      if (this.postForm.invoiceBaseDto.req_deli_date > value) {
        callback(new Error('提货日期不能超过到货日期'))
      } else if (new Date(value).getTime() < new Date().getTime()) {
        return this.$message.warning('到货时间不能小于当前时间')
      } else {
        callback()
      }
    }
    var deli_mobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机必填'))
      } else {
        const reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/
        // console.log(reg.test(parseInt(value.split('-').join(''))))
        if (value && !reg.test(parseInt(value.split('-').join('')))) {
          return callback(new Error('手机号码有误'))
        }
        callback()
      }
    }
    var deli_phone = (rule, value, callback) => {
      // if (!value && !this.postForm.deliInfoDto.deli_mobile) {
      //   return callback(new Error('手机必填'))
      // } else if (!value && this.postForm.deliInfoDto.deli_mobile) {
      //   callback()
      // } else {
      const reg = /^((0\d{2,3}-\d{3,4}-\d{4}))$/
      if (value && !reg.test(value)) {
        return callback(new Error('号码有误,格式为0XX(X)-XXX(X)-XXXX'))
      }
      callback()
      // }
    }
    var arri_mobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机必填'))
      } else {
        const reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/
        // console.log(parseInt(value.split('-').join('')))
        if (value && !reg.test(parseInt(value.split('-').join('')))) {
          return callback(new Error('手机号码有误'))
        }
        callback()
      }
    }
    var arri_phone = (rule, value, callback) => {
      // if (!value && !this.postForm.arriInfoDto.arri_mobile) {
      //   return callback(new Error('手机必填'))
      // } else {
      const reg = /^((0\d{2,3}-\d{3,4}-\d{4}))$/
      if (value && !reg.test(value.split('-').join(''))) {
        return callback(new Error('号码有误,格式为0XX(X)-XXX(X)-XXXX'))
      }
      callback()
      // }
    }
    return {
      postForm: {
        invoiceBaseDto: {
          pk_trans_type: '5fda0edc8df34b4d8c1ed44a6f1f866e', // 运输方式
          req_deli_date: '', // 提货日期
          req_arri_date: '', // 到货日期
          goods_name: '', // 货品名称
          car_length: [], // 车长
          car_model: '厢式车', // 车型
          weight_count: '', // 总重量
          num_count: '', // 总件数
          volume_count: '', // 总体积
          contract_amount: 0, // 合同总额
          amount: 0, // 货物总价值
          insurance_amount: 0, // 保险总金额
          balatype: '0', // 结算方式
          if_urgent: 'N', // 是否加急
          if_back_bill: '',
          special_req: '', // 特殊要求
          trans_type: 1,
          if_insurance: 'N', // 是否保险
          wait_fee: '',
          other_fee: '',
          pk_carrier: '', // 提货方
          bala_carrier: '',
          ent_customer: '', // 委托客户
          vbillno: '', // 订单单号
          custOrderno: '',
          handlingCode: '', // 增值服务
          pay_type: '1', // 支付方式
          pk_customer: '', // 委托客户
          bala_customer: ''// 结算客户
        },
        deliInfoDto: {
          pk_delivery: '', // 发货方
          deli_province: '', // 提货省份
          deli_city: '', // 提货城市
          deli_area: '', // 提货区域
          deli_detail_addr: '', // 提货详细地址
          deli_contact: '', // 提货联系人
          deli_phone: '', // 提货座机
          deli_mobile: '', // 提货手机
          deli_memo: '' // 提货备注
        },
        arriInfoDto: {
          pk_arrival: '', // 到货方
          arri_contact: '', // 到货联系人
          arri_phone: '', // 到货电话
          arri_mobile: '', // 到货手机
          arri_province: '', // 到货省份
          arri_city: '', // 到货城市
          arri_area: '', // 到货区域
          arri_detail_addr: '', // 到货详细地址
          arri_memo: '' // 到货备注
        },
        userCode: '15001962939',
        goodsInfoDtoList: [],
        attamentDto: [],
        ftpUrl: ''
      },
      loading: false,
      baseinfoShow: true,
      baseinfoShowTwo: true,
      baseinfoShowThree: true,
      baseinfoShowFour: true,
      baseinfoShowFive: true,
      carrierList: [],
      addressList: [],
      addressName: [],
      goodsNames: [],
      goodsPack: [{
        label: '箱', value: '箱'
      }, {
        label: '桶', value: '桶'
      }, {
        label: '托盘', value: '托盘'
      }],
      pk_trans_typeOptions: EnumType.pk_trans_typeOptions,
      handlingCodeOptions: EnumType.serviceStates,
      payOptions: EnumType.paymentStates,
      car_lengthOptions: EnumType.carLengthStates,
      create_user: '张三',
      num: '', // 回单数
      vbillno: '',
      vbillstatus: '0', // 订单状态
      dialogAttachmentVisible: false,
      flag: false,
      index: '',
      entCustomerList: [],
      attachNum: '',
      sysCode: '',
      goodList: {
        sel: null, // 选中行
        columns: [
          { field: 'goods_code', title: '货品编码', width: 100 },
          { field: 'goods_name', title: '货物名称', width: 100 },
          { field: 'num', title: '件数', width: 120 },
          { field: 'weight', title: '重量(t)', width: 120 },
          { field: 'volume', title: '体积(m³)', width: 120 },
          { field: 'pack', title: '包装单位', width: 100 }
        ],
        data: []
      },
      revenueList: {
        sel: null, // 选中行
        columns: [
          // { field: 'pk_customer', title: '委托客户' },
          // { field: 'bala_customer', title: '结算客户' },
          { field: 'vbillstatus', title: '状态' },
          { field: 'expense_type', title: '费目' },
          { field: 'sub_fee', title: '是否代收', width: '30px' },
          { field: 'cost_amount', title: '合计(元)' },
          // { field: 'bala_type', title: '结算方式' },
          // { field: 'pay_type', title: '支付方式' },
          { field: 'memo', title: '备注' }
          // { field: 'c', title: '录入人' },
          // { field: 'd', title: '录入日期' }
        ],
        data: []
      },
      rules: {
        'invoiceBaseDto.req_deli_date': [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          },
          {
            validator: req_deli_date, trigger: 'blur'
          }
        ],
        'invoiceBaseDto.req_arri_date': [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          },
          {
            validator: req_arri_date, trigger: 'blur'
          }

        ],
        'invoiceBaseDto.car_length': [
          {
            validator: car_length, trigger: 'blur'
          }

        ],
        'invoiceBaseDto.pk_carrier': [
          { required: true, message: '请选择承运商', trigger: 'change' }
        ],
        'invoiceBaseDto.pk_customer': [
          { required: true, message: '请选择委托客户', trigger: 'change' }
        ],
        'invoiceBaseDto.bala_customer': [
          { required: true, message: '请选择结算客户', trigger: 'change' }
        ],
        'invoiceBaseDto.pay_type': [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        'invoiceBaseDto.pk_trans_type': [
          { required: true, message: '请选择运输方式', trigger: 'change' }
        ],
        'deliInfoDto.pk_delivery': [
          { required: true, message: '请选择发货方', trigger: 'change' }
        ],
        'deliInfoDto.deli_province': [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        'deliInfoDto.deli_city': [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        'deliInfoDto.deli_area': [
          { required: true, message: '请输入区', trigger: 'change' }
        ],
        'deliInfoDto.deli_detail_addr': [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        'deliInfoDto.deli_contact': [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        'deliInfoDto.deli_mobile': [
          // { required: true, message: '请输入联系手机', trigger: 'change' },
          { validator: deli_mobile, trigger: 'change' }
        ],
        'deliInfoDto.deli_phone': [
          { validator: deli_phone, trigger: 'change' }
        ],
        'arriInfoDto.pk_arrival': [
          { required: true, message: '请输入收货方', trigger: 'change' }
        ],
        'arriInfoDto.arri_contact': [
          { required: true, message: '请输入收货联系人', trigger: 'change' }
        ],
        'arriInfoDto.arri_mobile': [
          { validator: arri_mobile, trigger: 'change' }
        ],
        'arriInfoDto.arri_phone': [
          { validator: arri_phone, trigger: 'change' }
        ],
        'arriInfoDto.arri_province': [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        'arriInfoDto.arri_city': [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        'arriInfoDto.arri_area': [
          { required: true, message: '请输入区', trigger: 'change' }
        ],
        'arriInfoDto.arri_detail_addr': [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    arri_phone() {
      return this.postForm.arriInfoDto.arri_phone
    },
    arri_mobile() {
      return this.postForm.arriInfoDto.arri_mobile
    },
    deli_mobile() {
      return this.postForm.deliInfoDto.deli_mobile
    },
    deli_phone() {
      return this.postForm.deliInfoDto.deli_phone
    },
    attamentDto() {
      return this.postForm.attamentDto
    }
  },
  watch: {
    arri_phone(newValue, oldValue) {
      this.postForm.arriInfoDto.arri_phone = newValue
    },
    arri_mobile(newValue, oldValue) {
      this.postForm.arriInfoDto.arri_mobile = this.phoneReplace(newValue)
    },
    deli_mobile(newValue, oldValue) {
      this.postForm.deliInfoDto.deli_mobile = this.phoneReplace(newValue)
    },
    deli_phone(newValue, oldValue) {
      this.postForm.deliInfoDto.deli_phone = newValue
    }
  },
  created() {
    this.sysCode = getSysCode()
    // console.log(this.sysCode)
    // console.log(this.$store.getters)
    if (this.isEdit) {
      this.getEditOrder()
      this.getCostInfo()
    } else {
      if (this.sysCode === '100004') {
        this.postForm.invoiceBaseDto.pk_customer = this.$store.getters.company
        this.postForm.invoiceBaseDto.bala_customer = this.$store.getters.company
      }

      if (this.$route.params.form) {
        this.$nextTick(() => {
          this.postForm = Object.assign({}, this.$route.params.form)
          for (const item of this.postForm.goodsInfoDtoList) {
            this.goodList.data.push({ 'goods_code': item.goods_code,
              'goods_name': item.goods_name,
              'num': item.num,
              'volume': item.volume,
              'weight': item.weight,
              'pack': item.pack,
              'isSet': false })
          }
        })
      }
      this.$forceUpdate()
    }
    this.getEntCustomerList()
    this.getCarrierList()
    this.getAddressList()
    this.goodsName()
  },
  mounted() {

  },
  methods: {
    checkPermission,
    changeItem(item) {
      if (item) {
        return Number(item).toFixed(3)
      } else {
        return '0.000'
      }
    },
    changeBala(val) {
      // console.log(val)
      if (val) {
        this.postForm.invoiceBaseDto.bala_customer = val
      } else {
        this.postForm.invoiceBaseDto.bala_customer = ''
      }
    },
    // 获取费用信息
    getCostInfo() {
      const data = {
        invoice_vbillno: this.$route.params.vbillno,
        userCode: '15001962939'
      }
      costInfo(data).then(response => {
        // console.log(response.data.data)
        this.revenueList.data = []
        for (const item of response.data.data.costInfoVOs) {
          this.revenueList.data.push({
            'vbillstatus': this.changeState(item.vbillstatus),
            'expense_type': item.expense_type,
            'cost_amount': item.cost_amount,
            'memo': item.memo,
            'sub_fee': item.sub_fee,
            'pk_fee': item.pk_fee,
            'isSet': false })
        }
      })
    },
    changeState(item) {
      if (item === 0) {
        return '未确认'
      } else if (item === 1) {
        return '已确认'
      } else if (item === 2) {
        return '已对账'
      } else if (item === 3) {
        return '已开票'
      } else if (item === 4) {
        return '已核销'
      } else {
        return ''
      }
    },
    // 获取委托客户列表
    getEntCustomerList() {
      const data = {
        type: '2'
      }
      this.entCustomerList = []
      getEntCustomer(data).then(response => {
        for (let i = 0; i < response.data.datas.length; i++) {
          response.data.datas[i].cust_name = response.data.datas[i].cust_name === null ? '' : response.data.datas[i].cust_name
        }
        sortList.pingyin(response.data.datas, ['pingyin'], 'cust_name')
        this.entCustomerList = response.data.datas.map(item => {
          return { value: item.pk_customer, label: item.cust_name }
        })
      })
    },
    phoneReplace(newValue) {
      if (newValue) {
        let value = newValue.replace(/\D/g, '').substring(0, 12)
        // console.log(value)
        const valueLen = value.length
        if (valueLen > 3 && valueLen < 8) {
          value = `${value.substr(0, 3)}-${value.substr(3)}`
        } else if (valueLen === 12) {
          value = `${value.substr(0, 4)}-${value.substr(4, 4)}-${value.substr(8)}`
        } else {
          value = `${value.substr(0, 3)}-${value.substr(3, 4)}-${value.substr(7)}`
        }
        return value
      }
    },
    // 是否加急
    insurance(val) {
      if (val > 0) {
        this.if_insurance = 'Y'
      } else {
        this.if_insurance = 'N'
      }
    },
    // 获取编辑订单信息
    getEditOrder() {
      const data = {
        vbillno: this.$route.params.vbillno
      }
      this.postForm.goodsInfoDtoList = []
      this.postForm.attamentDto = []
      editInterface(data).then(response => {
        for (const item of response.data.data.goodsInfoDtoList) {
          this.goodList.data.push({ 'goods_code': item.goods_code,
            'goods_name': item.goods_name,
            'num': item.num,
            'volume': item.volume,
            'weight': item.weight,
            'pack': item.pack,
            'isSet': false })
        }
        this.$nextTick(() => {
          const invoiceBaseDto = response.data.data.invoiceBaseDto
          if (!invoiceBaseDto.car_length) {
            invoiceBaseDto.car_length = []
          } else {
            // invoiceBaseDto.car_length = invoiceBaseDto.car_length.split(',')
          }
          const deliInfoDto = response.data.data.deliInfoDto
          const arriInfoDto = response.data.data.arriInfoDto
          const attamentDto = response.data.data.attamentDto
          const goodsInfoDtoList = response.data.data.goodsInfoDtoList
          this.vbillstatus = response.data.data.invoiceBaseDto.vbillstatus
          this.postForm.invoiceBaseDto = Object.assign({}, invoiceBaseDto)
          this.postForm.deliInfoDto = Object.assign({}, deliInfoDto)
          this.postForm.arriInfoDto = Object.assign({}, arriInfoDto)
          this.postForm.attamentDto = attamentDto
          this.postForm.goodsInfoDtoList = goodsInfoDtoList
          this.postForm.ftpUrl = response.data.data.ftpUrl
          if (this.postForm.invoiceBaseDto.balatype === '现结') {
            this.$set(this.postForm.invoiceBaseDto, 'balatype', '1')
          } else {
            this.$set(this.postForm.invoiceBaseDto, 'balatype', '0')
          }
          if (this.postForm.invoiceBaseDto.pk_trans_type === '整车运输') {
            this.$set(this.postForm.invoiceBaseDto, 'pk_trans_type', '5fda0edc8df34b4d8c1ed44a6f1f866e')
          } else {
            this.$set(this.postForm.invoiceBaseDto, 'pk_trans_type', 'e5e602a22c5a4689b8d151c76a4d1179')
          }
          if (this.postForm.invoiceBaseDto.pk_carrier) {
            for (var item of this.carrierList) {
              if (this.postForm.invoiceBaseDto.pk_carrier === item.label) {
                this.$set(this.postForm.invoiceBaseDto, 'pk_carrier', item.value)
              }
            }
          }
          if (this.postForm.invoiceBaseDto.pk_customer) {
            for (const item2 of this.entCustomerList) {
              if (this.postForm.invoiceBaseDto.pk_customer === item2.label) {
                this.$set(this.postForm.invoiceBaseDto, 'pk_customer', item2.value)
              }
            }
          }
          if (this.postForm.invoiceBaseDto.bala_customer) {
            for (const item3 of this.entCustomerList) {
              if (this.postForm.invoiceBaseDto.bala_customer === item3.label) {
                this.$set(this.postForm.invoiceBaseDto, 'bala_customer', item3.value)
              }
            }
          }
          if (this.postForm.attamentDto.length <= 0) {
            this.attachNum = ''
          } else {
            this.attachNum = this.postForm.attamentDto.length
          }
        })
        this.$forceUpdate()
      })
    },
    // 获取供应商列表
    getCarrierList() {
      this.carrierList = []
      getCarrier().then(response => {
        for (var i = 0; i < response.data.datas.length; i++) {
          response.data.datas[i].carr_name = response.data.datas[i].carr_name === null ? '' : response.data.datas[i].carr_name
        }
        sortList.pingyin(response.data.datas, ['pingyin'], 'carr_name')

        this.carrierList = response.data.datas.map(item => {
          return { value: item.pk_carrier, label: item.carr_name }
        })
      })
    },

    // 获取地址列表
    getAddressList() {
      this.addressList = []
      const data = {
        userCode: this.postForm.userCode
      }
      getAddress(data).then(response => {
        //   console.log(response.data.datas);
        this.addressList = response.data.datas
        this.addressName = this.addressList.map(item => {
          return { value: item.address_name, label: item.address_name }
        })
      })
    },
    // 获取货物名称
    goodsName() {
      getGoodsName().then(response => {
        // console.log(response.data.datas)
        this.goodsNames = response.data.datas.map(item => {
          return { value: item, label: item }
        })
      })
    },
    // 选择对应地址信息
    deliveryName() {
      if (this.postForm.deliInfoDto.pk_delivery) {
        for (var item of this.addressList) {
          // console.log(this.postForm.pk_delivery);
          if (this.postForm.deliInfoDto.pk_delivery === item.address_name) {
            this.postForm.deliInfoDto.deli_province = item.province_name
            this.postForm.deliInfoDto.deli_city = item.city_name
            this.postForm.deliInfoDto.deli_area = item.area_name
            this.postForm.deliInfoDto.deli_detail_addr = item.detail_addr_name
            this.postForm.deliInfoDto.deli_contact = item.contact
            this.postForm.deliInfoDto.deli_mobile = item.mobile
            this.postForm.deliInfoDto.deli_phone = item.phone
          }
        }
      }
    },
    arrivalName() {
      if (this.postForm.arriInfoDto.pk_arrival) {
        for (const item of this.addressList) {
          if (this.postForm.arriInfoDto.pk_arrival === item.address_name) {
            this.postForm.arriInfoDto.arri_province = item.province_name
            this.postForm.arriInfoDto.arri_city = item.city_name
            this.postForm.arriInfoDto.arri_area = item.area_name
            this.postForm.arriInfoDto.arri_detail_addr = item.detail_addr_name
            this.postForm.arriInfoDto.arri_contact = item.contact
            this.postForm.arriInfoDto.arri_mobile = item.mobile
            this.postForm.arriInfoDto.arri_phone = item.phone
          }
        }
      }
    },
    // 求和
    summation() {
      const iterable = new Map([['weight_count', 'weight'], ['num_count', 'num'], ['volume_count', 'volume']])
      for (const [key, value] of iterable) {
        this.postForm.invoiceBaseDto[key] = this.goodList.data.map(item => Number.isNaN(parseFloat(item[value])) ? 0 : parseFloat(item[value]))
          .reduce((total, num) => total + num)
      }
    },
    // 编辑货物信息
    editInfo(row, index, cg, item, data) {
      // console.log(row.isSet)
      this.index = index
      this.flag = row.isSet
      var msg = data
      // 点击修改 判断是否已经保存所有操作
      for (const i of item.data) {
        if (i.isSet && i.isSet !== row.isSet) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      // 是否是取消操作
      if (!cg) {
        // console.log(this.goodList.sel.isSet)
        if (item.sel.isSet) item.data.splice(index, 1)
        return (row.isSet = !row.isSet)
      }
      // 提交数据
      // debugger
      if (row.isSet) {
        if (msg === 'goods' && (item.sel.weight <= 0)) {
          return this.$message.warning('请确认货物信息的重量')
        }
        if (msg === 'revenueList' && (!item.sel.expense_type || !item.sel.cost_amount)) {
          return this.$message.warning('请确认费目和合计金额')
        }
        if (msg === 'revenueList' && (item.sel.vbillstatus !== '未确认')) {
          return this.$message.warning('未确认的费用才能编辑')
        }
        for (let i = 0; i < this.goodList.data.length; i++) {
          if (i !== index && this.goodList.data[i].goods_code === item.sel.goods_code) {
            return this.$message.warning('货品编码重复')
          }
        }
        const data = JSON.parse(JSON.stringify(item.sel))
        for (const k in data) row[k] = data[k]

        this.summation()
        if (msg === 'revenueList') {
          const data = {
            fee_type: 1,
            sub_fee: item.sel.sub_fee,
            expense_type: item.sel.expense_type,
            pk_customer: this.postForm.invoiceBaseDto.pk_customer,
            pay_type: this.postForm.invoiceBaseDto.pay_type,
            bala_type: this.postForm.invoiceBaseDto.balatype,
            bala_customer: this.postForm.invoiceBaseDto.bala_customer,
            invoice_vbillno: this.postForm.invoiceBaseDto.vbillno,
            deli_address: this.postForm.deliInfoDto.deli_detail_addr,
            memo: item.sel.memo,
            cost_amount: item.sel.cost_amount,
            pk_fee: item.sel.pk_fee,
            userCode: '15111111112'
          }
          this.editFee(data)
        }
        row.isSet = false
      } else {
        // console.log(this.goodList.sel);
        item.sel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
      this.$forceUpdate()
    },
    // 新增信息
    addGoodspack(item) {
      this.flag = false
      for (const i of item.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const j = {
        goods_code: '',
        goods_name: '',
        num: '1',
        volume: '',
        weight: '',
        pack: '',
        isSet: true
      }
      item.data.push(j)
      item.sel = JSON.parse(JSON.stringify(j))
      this.$nextTick(() => {
        // debugger
        document.getElementById('goodstable').scrollIntoView()
        document.getElementById('goodstable').focus()
      })
    },
    addInfo(item) {
      this.flag = false
      for (const i of item.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const j = {
        // fee_type: 1,
        vbillstatus: '未确认',
        expense_type: '',
        pk_fee: '',
        sub_fee: 'N',
        // pk_customer: this.postForm.invoiceBaseDto.pk_customer,
        // pay_type: this.postForm.invoiceBaseDto.pay_type,
        // bala_type: this.postForm.invoiceBaseDto.balatype,
        // bala_customer: this.postForm.invoiceBaseDto.bala_customer,
        // invoice_vbillno: this.postForm.invoiceBaseDto.vbillno,
        // deli_address: this.postForm.deliInfoDto.deli_detail_addr,
        memo: '',
        cost_amount: '',
        isSet: true
      }
      item.data.push(j)
      item.sel = JSON.parse(JSON.stringify(j))
      this.$nextTick(() => {
        document.getElementById('revenuetable').scrollIntoView()
        document.getElementById('revenuetable').focus()
      })
    },
    // 删除信息
    deleteInfo(index, rows, data) {
      console.log(index, rows)
      if (data) {
        if (rows[index].vbillstatus !== '未确认') {
          return this.$message.warning('未确认的费用才能删除')
        }
        // console.log(data)
        this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFee({ pk_fee: data }).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 5000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作失败！'
          })
        })
      }
      rows.splice(index, 1)
      this.summation()
    },
    // 保存表单
    submitForm: Debounce(function() {
      for (const i of this.goodList.data) {
        if (i.isSet && i.isSet !== this.flag) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      for (const i of this.revenueList.data) {
        if (i.isSet && i.isSet !== this.flag) {
          this.$message.warning('请先保存当前编辑项')
          return false
        }
      }
      if (this.goodList.data.length <= 0) {
        this.$message.warning('请填写货物信息')
        return false
      }
      this.postForm.goodsInfoDtoList = this.goodList.data.filter(item => delete item.isSet)

      // console.log(this.postForm)
      const that = this
      const form = Object.assign({}, this.postForm)

      debugger
      this.$refs.postForm.validate(valid => {
        debugger
        if (valid) {
          // if (form.deliInfoDto.deli_mobile) {
          //   form.deliInfoDto.deli_mobile = form.deliInfoDto.deli_mobile.replace(/-/g, '')
          // }

          // if (form.arriInfoDto.arri_mobile) {
          //   form.arriInfoDto.arri_mobile = form.arriInfoDto.arri_mobile.replace(/-/g, '')
          // }
          // if (form.invoiceBaseDto.car_length.length > 0) {
          //   form.invoiceBaseDto.car_length = form.invoiceBaseDto.car_length.join(',')
          // }
          // console.log(form)
          if (!that.isEdit) {
            delete form.invoiceBaseDto.vbillno
            createOrder(form).then(function(response) {
              // console.log(response)
              if (response.data.success) {
                that.$message({
                  type: 'success',
                  message: '保存成功!',
                  duration: 5000
                })

                that.$refs['postForm'].resetFields()
                // that.postForm = Object.assign(that.postForm, defaultForm)
                that.postForm.arriInfoDto.arri_phone = ''
                that.postForm.deliInfoDto.deli_phone = ''
                that.postForm.invoiceBaseDto.weight_count = ''
                that.postForm.invoiceBaseDto.num_count = ''
                that.postForm.invoiceBaseDto.volume_count = ''
                that.postForm.goodsInfoDtoList = []
                that.postForm.attamentDto = []
                that.goodList.data.splice(0, that.goodList.data.length)
                that.vbillno = response.data.data.vbillno

                that.$nextTick(() => {
                  that.$router.push({ name: 'EditForm', params: { vbillno: that.vbillno }})
                })
                // this.$set(this.postForm.invoiceBaseDto, 'balatype', '0')
                // that.$nextTick(() => {
                //   for (let i = 0; i < that.postForm.goodsInfoDtoList.length; i++) {
                //     that.postForm.goodsInfoDtoList.splice(i, 1)
                //     i--
                //   }
                // })
                // that.$forceUpdate()
              } else {
                that.$message({
                  type: 'warning',
                  message: '保存失败!' + response.data.msg
                })
              }
            })
          } else {
            // console.log(form)
            createOrder(form).then(function(response) {
              // console.log(that.postForm.invoiceBaseDto.car_length)
              if (response.data.success) {
                that.$message({
                  type: 'success',
                  message: '保存成功!',
                  duration: 5000
                })
                if (!that.postForm.invoiceBaseDto.car_length) {
                  that.postForm.invoiceBaseDto.car_length = []
                } else {
                  // that.postForm.invoiceBaseDto.car_length = that.postForm.invoiceBaseDto.car_length.split(',')
                }
              } else {
                that.$message({
                  type: 'warning',
                  message: '保存失败!' + response.data.msg
                })
              }
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '有未填项信息!'
          })
          console.log('error submit!!')
          return false
        }
      })
    }),
    selectUpload(selection) {
      // console.log(selection)
      // debugger
      this.postForm.attamentDto = []
      for (const item of selection) {
        this.postForm.attamentDto.push({ 'originType': this.changeType(item.originType),
          'url': item.url
        })
      }
      if (this.postForm.attamentDto.length <= 0) {
        this.attachNum = ''
      } else {
        this.attachNum = this.postForm.attamentDto.length
      }
    },
    changeType(type) {
      if (type === '提货' || type === '0') {
        return '0'
      } else if (type === '到货' || type === '1') {
        return '1'
      } else if (type === '签收' || type === '2') {
        return '2'
      } else if (type === '回单' || type === '3') {
        return '3'
      } else if (type === '异常反馈' || type === '4') {
        return '4'
      } else {
        return '5'
      }
    },
    // 确认订单
    confirmInvoice() {
      this.$confirm('此操作将确认该记录, 是否确认?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        var confirmJson = {
          vbillno: this.postForm.invoiceBaseDto.vbillno,
          userCode: '15001962939'
        }
        confirmOrder(confirmJson).then(response => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '确认成功!'
            })
            this.vbillstatus = '1'
            this.postForm.invoiceBaseDto.vbillstatus = '已确认'
          } else {
            this.$message({
              type: 'warning',
              message: '操作失败!' + response.data.msg
            })
          }
        })
      })
    },
    // 复制新增
    copyAdd() {
      var newForm = Object.assign({}, this.postForm)
      newForm.invoiceBaseDto.vbillno = ''
      delete newForm.invoiceBaseDto.vbillstatus
      this.$nextTick(() => {
        this.$router.push({ name: 'CreateForm', params: { form: newForm }})
      })
    },
    // 编辑费目
    editFee(data) {
      addOrUpdateFee(data).then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '保存成功!',
            duration: 5000
          })
          // console.log(response.data)
          this.$set(this.revenueList.data[this.index], 'pk_fee', response.data.pk)
        } else {
          this.$message({
            type: 'warning',
            message: '保存失败!',
            duration: 5000
          })
        }
      })
    },
    // 删除费目
    cancelFee(data) {
      deleteFee(data).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功!',
          duration: 5000
        })
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计：'
          return
        }
        if (index !== 3) {
          sums[index] = ''
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0).toFixed(2)
          sums[index] += '(元)'
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    changeCarLength() {
      if (this.postForm.invoiceBaseDto.pk_trans_type !== '5fda0edc8df34b4d8c1ed44a6f1f866e') {
        this.postForm.invoiceBaseDto.car_length = []
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  background: #eff3f8;
  .createPost-main-container {
    padding: 20px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
    .btnGreen {
      margin-bottom: 10px;
    }
    .tableMargin{
      margin-bottom: 80px;
    }

  }

}
</style>
<style>
    .redItem .el-form-item__label{
        color: red;
    }
</style>
